// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

// required by component
import { ChatMenuItems } from './menu.items';
import { User, ChatMessage } from '../../models';
import { FormConfig } from '../../../web-components/dynamic-form';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

@Component({
    templateUrl: 'chat.component.html'
})
export class ChatComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<ChatMessage> | null;
    private chatMessages: ChatMessage[] | null;

    private chatMessagesPage: number = 1;
    private chatMessagesPageSize: number = 10;
    private chatMessagesSearch: string = '';
    private allChatMessagesLoaded: boolean = false;

    private readonly debounceTime = 300;
    private searchControl = new FormControl();

    private noConversationFound: boolean = false;
    private noUserFound: boolean = false;
    private activeChatUserId: number;

    private readonly clientsPageSize: number = 200;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService)

    }

    ngOnInit(): void {
        super.ngOnInit();
        super.subscribeToObservables(this.getComponentObservables());

        // init chat search
        this.initSearch();

        // make sure the menu is initialized by searching for all users at the init
        this.dependencies.coreServices.sharedService.setComponentSearch('');
    }

    private initSearch(): void {
        this.searchControl.valueChanges
            .debounceTime(this.debounceTime)
            .subscribe(searchTerm => {
                // reset page to 1 when searching
                this.chatMessagesPage = 1;
                this.chatMessagesSearch = searchTerm;
                super.subscribeToObservable(this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, true, this.chatMessagesSearch));
            });
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];
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
                    .WhereLikeMultiple(['FirstName', 'LastName'], search)
                    .orderByAsc('FirstName')
                    .get()
                    .takeUntil(this.ngUnsubscribe);
            })
            .map(response => {
                this.setConfig({
                    menuItems: new ChatMenuItems(response.items).menuItems,
                    enableSearch: true
                });
            })
    }

    private getConverstationObservable(): Observable<any> {
        return this.activatedRoute.params
            .switchMap(params => {
                super.startGlobalLoader();
                this.resetChatUser();

                var userIdParam = +params['id'];

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
                    return Observable.empty()
                }

                var activeUser = response.items[0];

                this.activeChatUserId = activeUser.id;

                // update component config with users name
                super.setConfig({
                    componentTitle: { key: activeUser.getFullName() }
                });

                return Observable.of(response)
            })
            .switchMap(response => {
                if (!this.activeChatUserId) {
                    return Observable.of(response);
                }

                return this.getFormObservable(this.activeChatUserId);
            })
            .switchMap(response => {
                if (!this.activeChatUserId) {
                    return Observable.of(response);
                }

                return this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, true, this.chatMessagesSearch);
            })
            .map(() => super.stopAllLoaders())
    }

    private resetChatUser(): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = '';
        this.chatMessages = null;
        this.formConfig = null;
    }

    private setNoUserFound(): void {
        this.noConversationFound = false;
        this.noUserFound = true;
    }

    private setNoConversionFound(): void {
        this.noConversationFound = true;
        this.noUserFound = false;
    }

    private getFormObservable(userId: number): Observable<any> {
        return this.dependencies.itemServices.chatMessageService.insertForm()
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                // manually set recipient & sender
                form.withFieldValue('SenderUserId', this.dependencies.authenticatedUserService.getUserId());
                form.withFieldValue('RecipientUserId', userId);

                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.snackBarTextKey('module.clients.chat.snackbarSaved');
                form.submitTextKey('module.clients.chat.submit');
                form.insertFunction((item) => this.dependencies.itemServices.chatMessageService.create(item).set());
                form.onAfterInsert((response) => {
                    // reload messages
                    super.subscribeToObservable(this.getChatMessagesObservable(userId, 1, true, this.chatMessagesSearch)
                        .takeUntil(this.ngUnsubscribe));

                });

                this.formConfig = form.build();
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
                        if (this.chatMessages){
                            this.chatMessages = _.union(this.chatMessages, response.items);
                        }
                        else{
                            this.chatMessages = response.items;
                        }
                    }
                }
                else {
                    if (replaceMessages) {
                        this.chatMessages = [];
                    }
                    this.allChatMessagesLoaded = true;
                }
            },
            error => super.handleError(error));
    }

    private loadMoreMessages(): void {
        super.subscribeToObservable(this.getChatMessagesObservable(this.activeChatUserId, this.chatMessagesPage, false, this.chatMessagesSearch)
            .takeUntil(this.ngUnsubscribe));
    }

}