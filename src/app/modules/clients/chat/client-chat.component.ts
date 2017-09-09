// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { User, ChatMessage } from '../../../models';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

@Component({
    templateUrl: 'client-chat.component.html'
})
export class ClientChatComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<ChatMessage>;
    private chatMessages: ChatMessage[];

    private chatMessagesPage: number = 1;
    private readonly chatMessagesPageSize: number = 10;
    private chatMessagesSearch: string = '';
    private allChatMessagesLoaded: boolean = false;

    private readonly debounceTime = 300;
    private searchControl = new FormControl();

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: true })

    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initSearch();
        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private initSearch(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(searchTerm => {
                // reset page to 1 when searching
                this.chatMessagesPage = 1;
                this.chatMessagesSearch = searchTerm;
                super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, this.chatMessagesPage, true, this.chatMessagesSearch));
            });
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
                form.withFieldValue('SenderUserId', this.dependencies.authenticatedUserService.getUserId());
                form.withFieldValue('RecipientUserId', this.clientId)

                form.snackBarTextKey('module.clients.chat.snackbarSaved');
                form.submitTextKey('module.clients.chat.submit');
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                form.insertFunction((item) => this.dependencies.itemServices.chatMessageService.create(item).set());
                form.onAfterInsert((response) => {
                    // reload messages
                    super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, 1, true, this.chatMessagesSearch)
                        .takeUntil(this.ngUnsubscribe));

                });

                this.formConfig = form.build();
            },
            error => super.handleError(error))
    }

    private getInitChatMessagesObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(client => this.getChatMessagesObservable(client.id, this.chatMessagesPage, true, this.chatMessagesSearch))
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

    private getChatMessagesObservable(clientId: number, page: number, replaceMessages: boolean, search: string): Observable<any> {
        return this.dependencies.itemServices.chatMessageService.getConversationMessages(clientId)
            .includeMultiple(['Sender', 'Recipient'])
            .orderByDesc('Created')
            .page(page)
            .pageSize(this.chatMessagesPageSize)
            .whereLike('Message', search ? search : '')
            .get()
            .takeUntil(this.ngUnsubscribe)
            .map(response => {
                this.chatMessagesPage = page + 1;
                if (!response.isEmpty()) {
                    this.allChatMessagesLoaded = false;
                    if (replaceMessages) {
                        this.chatMessages = response.items;
                    }
                    else {
                        this.chatMessages = _.union(this.chatMessages, response.items);
                    }
                }
                else{
                    if (replaceMessages){
                        this.chatMessages = [];
                    }
                    this.allChatMessagesLoaded = true;
                }
            },
            error => super.handleError(error));
    }

    private loadMoreMessages(): void {
        super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, this.chatMessagesPage, false, this.chatMessagesSearch)
            .takeUntil(this.ngUnsubscribe));
    }
}