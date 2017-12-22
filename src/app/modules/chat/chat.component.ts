import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { DataFormConfig } from '../../../web-components/data-form';
import { AppConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { ChatMessage } from '../../models';
import { ChatMenuItems } from './menu.items';

@Component({
    templateUrl: 'chat.component.html'
})
export class ChatComponent extends BaseComponent implements OnInit {

    public formConfig?: DataFormConfig;
    public chatMessages?: ChatMessage[];

    public chatMessagesPage: number = 1;
    public chatMessagesPageSize: number = 10;
    public chatMessagesSearch: string = '';
    public allChatMessagesLoaded: boolean = false;

    public noConversationFound: boolean = false;
    public noUserFound: boolean = false;
    public activeChatUserId: number;

    private readonly clientsPageSize: number = 200;

    public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.subscribeToObservables(this.getComponentObservables());

        // make sure the menu is initialized by searching for all users at the init
        this.dependencies.coreServices.sharedService.setComponentSearch('');
    }

    private searchConversation(search: string): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = search;
        super.subscribeToObservable(this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, true, this.chatMessagesSearch));
    }

    private getComponentObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];
        observables.push(this.getSearchAndMenuObservable());
        observables.push(this.getConverstationObservable());
        return observables;
    }

    private getSearchAndMenuObservable(): Observable<any> {
        return this.dependencies.coreServices.sharedService.componentSearchChanged$
            .takeUntil(this.ngUnsubscribe)
            .switchMap(search => {
                return this.dependencies.itemServices.userService.clients()
                    .pageSize(this.clientsPageSize)
                    .whereLikeMultiple(['FirstName', 'LastName'], search)
                    .orderByAsc('FirstName')
                    .get()
                    .takeUntil(this.ngUnsubscribe);
            })
            .map(response => {
                this.setConfig({
                    menuItems: new ChatMenuItems(response.items).menuItems,
                    enableSearch: true
                });
            });
    }

    private getConverstationObservable(): Observable<any> {
        return this.activatedRoute.params
            .switchMap(params => {
                super.startGlobalLoader();
                this.resetChatUser();

                const userIdParam = +params['id'];

                if (!userIdParam) {
                    return this.dependencies.itemServices.userService.clients()
                        .orderByAsc('FirstName')
                        .limit(1)
                        .get();
                }

                return this.dependencies.itemServices.userService.clients()
                    .whereEquals('Id', userIdParam)
                    .limit(1)
                    .get();
            })
            .switchMap(response => {
                if (!response || !response.items[0]) {
                    this.setNoUserFound();
                    return Observable.empty();
                }

                const activeUser = response.items[0];

                this.activeChatUserId = activeUser.id;

                // update component config with users name
                super.setConfig({
                    componentTitle: { key: activeUser.getFullName() }
                });

                return Observable.of(response);
            })
            .switchMap(response => {
                if (!this.activeChatUserId) {
                    return Observable.of(response);
                }

                return this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, true, this.chatMessagesSearch);
            })
            .map(() => {
                this.initChatForm(this.activeChatUserId);

                super.stopAllLoaders();
            });
    }

    private resetChatUser(): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = '';
        this.chatMessages = undefined;
        this.formConfig = undefined;
    }

    private setNoUserFound(): void {
        this.noConversationFound = false;
        this.noUserFound = true;
    }

    private setNoConversionFound(): void {
        this.noConversationFound = true;
        this.noUserFound = false;
    }

    private initChatForm(userId: number): void {
        this.formConfig = this.dependencies.itemServices.chatMessageService.buildInsertForm()
            .fieldValueResolver((fieldName, value) => {
                // manually set recipient & sender
                if (fieldName === 'SenderUserId') {
                    return Observable.of(this.dependencies.authenticatedUserService.getUserId());
                }
                if (fieldName === 'RecipientUserId') {
                    return Observable.of(userId);
                }
                return Observable.of(value);
            })
            .customButtonSaveText(super.translate('module.chat.send'))
            .wrapInCard(false)
            .onAfterInsert((response) => {
                // reload messages
                super.subscribeToObservable(this.getChatMessagesObservable(userId, 1, true, this.chatMessagesSearch)
                    .takeUntil(this.ngUnsubscribe));

            })
            .build();
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
                        if (this.chatMessages) {
                            this.chatMessages = _.union(this.chatMessages, response.items);
                        } else {
                            this.chatMessages = response.items;
                        }
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
        super.subscribeToObservable(this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, false, this.chatMessagesSearch)
            .takeUntil(this.ngUnsubscribe));
    }
}
