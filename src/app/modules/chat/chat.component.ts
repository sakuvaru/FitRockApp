import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ResponseMultiple } from 'lib/repository';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { DataFormConfig } from '../../../web-components/data-form';
import { AppConfig } from '../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../core';
import { ChatMessage, User } from '../../models';

@Component({
    selector: 'mod-chat',
    templateUrl: 'chat.component.html'
})
export class ChatComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() initUsers: boolean = false;

    @Input() conversationUserId: number;

    @Output() usersLoaded = new EventEmitter<ResponseMultiple<User>>();
    @Output() activeUserLoad = new EventEmitter<User>();

     /**
     * Wrapper for main content
     */
    public readonly mainContentClass: string = '.' + AppConfig.MainContentWrapperClass;

    public formConfig?: DataFormConfig;
    public chatMessages?: ChatMessage[];

    public chatMessagesPage: number = 1;
    public chatMessagesPageSize: number = 25;
    public chatMessagesSearch: string = '';
    public allChatMessagesLoaded: boolean = false;

    public noConversationFound: boolean = false;
    public noUserFound: boolean = false;

    private readonly clientsPageSize: number = 200;

    public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;

    public users: User[] = [];

    public currentUserId: number = 0;

    public loadMoreLoaderEnabled: boolean = false;

    constructor(
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.initUsers) {
            this.initMenuAndUsers();
        } 

        if (!this.conversationUserId) {
            this.initConversation();
        }

        if (this.authUser) {
            this.currentUserId = this.authUser.id;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.conversationUserId.currentValue) {
            this.initConversation();
        }
    }

    loadMoreMessages(): void {
        this.loadMoreLoaderEnabled = true;
        super.subscribeToObservable(this.getChatMessagesObservable(this.conversationUserId, this.chatMessagesPage, false, this.chatMessagesSearch), {
            enableLoader: false
        });
    }

    searchConversation(search: string): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = search;
        super.subscribeToObservable(this.getChatMessagesObservable(this.conversationUserId, this.chatMessagesPage, true, this.chatMessagesSearch));
    }

    getUserImageUrl(user: User): string {
        const avatarOrGravatar = user.getAvatarOrGravatarUrl();
        if (avatarOrGravatar) {
            return avatarOrGravatar;
        }

        return AppConfig.DefaultUserAvatarUrl;
    }

    onScroll(): void {
        this.loadMoreMessages();
    }

    private initMenuAndUsers(): void {
        super.subscribeToObservable(this.getSearchAndMenuObservable());
        // make sure the menu is initialized by searching for all users at the init
        this.dependencies.coreServices.sharedService.setComponentSearch('');
    }

    private initConversation(): void {
        super.subscribeToObservable(this.getConverstationObservable());
    }

    private getSearchAndMenuObservable(): Observable<void> {
        return this.dependencies.coreServices.sharedService.componentSearchChanged$
            .switchMap(search => {
                return this.dependencies.itemServices.userService.clients()
                    .pageSize(this.clientsPageSize)
                    .whereLikeMultiple(['FirstName', 'LastName'], search)
                    .orderByAsc('FirstName')
                    .get();
            })
            .map(response => {
                this.users = response.items;
                this.usersLoaded.next(response);
            });
    }

    private getConverstationObservable(): Observable<void> {
        let userQuery: Observable<ResponseMultiple<User>>;

        let activeUser: User;

        if (!this.conversationUserId) {
            userQuery = this.dependencies.itemServices.userService.clients()
                .orderByAsc('FirstName')
                .limit(1)
                .get();

        } else {
            userQuery = this.dependencies.itemServices.userService.clients()
                .whereEquals('Id', this.conversationUserId)
                .limit(1)
                .get();
        }

        return userQuery.switchMap(response => {
            this.resetChatUser();

            if (!response || !response.items[0]) {
                this.setNoUserFound();
                return Observable.empty();
            }

            activeUser = response.items[0];

            this.conversationUserId = activeUser.id;

            this.activeUserLoad.next(activeUser);

            return Observable.of(response);
        })
            .switchMap(response => {
                return this.getChatMessagesObservable(activeUser.id, this.chatMessagesPage, true, this.chatMessagesSearch);
            })
            .map(() => {
                this.initChatForm(activeUser.id);
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
            .configField((field, item) => {
                // manually set recipient & sender
                if (field.key === 'SenderUserId') {
                    field.value = this.dependencies.authenticatedUserService.getUserId();
                }
                if (field.key === 'RecipientUserId') {
                    field.value = userId;
                }
                return Observable.of(field);
            })
            .hideButtonsOnLargeScreen(true)
            .customButtonSaveText(super.translate('module.chat.send'))
            .wrapInCard(false)
            .onAfterInsert((response) => {
                // reload messages
                super.subscribeToObservable(this.getChatMessagesObservable(userId, 1, true, this.chatMessagesSearch));

            })
            .build();
    }

    private getChatMessagesObservable(clientId: number, page: number, replaceMessages: boolean, search: string): Observable<void> {
        return this.dependencies.itemServices.chatMessageService.getConversationMessages(clientId)
            .includeMultiple(['Sender', 'Recipient'])
            .orderByDesc('Created')
            .page(page)
            .pageSize(this.chatMessagesPageSize)
            .whereLike('Message', search ? search : '')
            .get()
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

                this.loadMoreLoaderEnabled = false;
            });
    }
}
