import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { DataFormConfig } from '../../../../web-components/data-form';
import { AppConfig } from '../../../config';
import { ComponentDependencyService, ComponentSetup } from '../../../core';
import { ChatMessage } from '../../../models';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';

@Component({
    templateUrl: 'client-chat.component.html'
})
export class ClientChatComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: DataFormConfig;
    public chatMessages: ChatMessage[];

    public chatMessagesPage: number = 1;
    private readonly chatMessagesPageSize: number = 10;
    public chatMessagesSearch: string = '';
    public allChatMessagesLoaded: boolean = false;

    public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute);

    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    searchConversation(search: string): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = search;
        super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, this.chatMessagesPage, true, this.chatMessagesSearch));
    }

    private getComponentObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];
        observables.push(this.getFormObservable());
        observables.push(this.getInitChatMessagesObservable());
        return observables;
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                const formConfig = this.dependencies.itemServices.chatMessageService.buildInsertForm()
                    .fieldValueResolver((fieldName, value) => {
                        // manually set recipient & sender
                        if (fieldName === 'SenderUserId') {
                            return Observable.of(this.dependencies.authenticatedUserService.getUserId());
                        } else if (fieldName === 'RecipientUserId') {
                            return Observable.of(this.clientId);
                        }
                        return Observable.of(value);
                    })
                    .wrapInCard(false)
                    .onAfterInsert((response) => {
                        // reload messages
                        super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, 1, true, this.chatMessagesSearch)
                            .takeUntil(this.ngUnsubscribe));
                    })
                    .build();

                this.formConfig = formConfig;
            },
            error => super.handleAppError(error));
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
                    },
                    menuAvatarUrl: this.client.avatarUrl
                });
            },
            error => super.handleAppError(error));
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
                    } else {
                        this.chatMessages = _.union(this.chatMessages, response.items);
                    }
                } else {
                    if (replaceMessages) {
                        this.chatMessages = [];
                    }
                    this.allChatMessagesLoaded = true;
                }
            },
            error => super.handleAppError(error));
    }

    private loadMoreMessages(): void {
        super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, this.chatMessagesPage, false, this.chatMessagesSearch)
            .takeUntil(this.ngUnsubscribe));
    }
}
