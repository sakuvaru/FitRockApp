// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { User, ChatMessage } from '../../../models';
import { DataFormConfig } from '../../../../web-components/data-form';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

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

    private readonly debounceTime = 300;
    public searchControl = new FormControl();

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
            error => super.handleError(error));
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
            error => super.handleError(error));
    }

    private loadMoreMessages(): void {
        super.subscribeToObservable(this.getChatMessagesObservable(this.clientId, this.chatMessagesPage, false, this.chatMessagesSearch)
            .takeUntil(this.ngUnsubscribe));
    }
}
