// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { User, ChatMessage } from '../../../models';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'client-chat.component.html'
})
export class ClientChatComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<ChatMessage>;
    private chatMessages: ChatMessage[];

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: true })

    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];
        observables.push(this.getFormObservable());
        observables.push(this.getInitChatMessagesObservable());
        return observables;
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.chatMessageService.insertForm()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map(form => {
                // manually set recipient & sender
                form.withFieldValue('SenderUserId',  this.dependencies.authenticatedUserService.getUserId());
                form.withFieldValue('RecipientUserId', this.clientId)

                form.snackBarTextKey('module.clients.chat.snackbarSaved');
                form.submitTextKey('module.clients.chat.submit');
                form.onFormInit(() => super.stopLoader())
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.insertFunction((item) => this.dependencies.itemServices.chatMessageService.create(item).set());
                form.onAfterInsert((response) => {
                    // reload messages
                    this.getChatMessagesObservable(this.clientId)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe();
                });
                form.onError(() => super.stopGlobalLoader());

                this.formConfig = form.build();
            },
            error => super.handleError(error))
    }

    private getInitChatMessagesObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(client => this.getChatMessagesObservable(client.id))
            .map(response => {
                this.setConfig({
                    menuItems: new ClientMenuItems(this.clientId).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': this.client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.chat'
                    }
                });
            },
            error => super.handleError(error));
    }

    private getChatMessagesObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.chatMessageService.getConversationMessages(clientId)
            .includeMultiple(['Sender', 'Recipient'])
            .orderByDesc('Created')
            .get()
            .takeUntil(this.ngUnsubscribe)
            .map(response => {
                if (!response.isEmpty()) {
                    this.chatMessages = response.items;
                }
            },
            error => super.handleError(error));
    }
}