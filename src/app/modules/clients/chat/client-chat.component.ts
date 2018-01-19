import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { DataFormConfig } from '../../../../web-components/data-form';
import { AppConfig } from '../../../config';
import { ComponentDependencyService } from '../../../core';
import { ChatMessage } from '../../../models';
import { BaseClientModuleComponent } from '../base-client-module.component';

@Component({
    selector: 'mod-client-chat',
    templateUrl: 'client-chat.component.html'
})
export class ClientChatComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public formConfig: DataFormConfig;
    public chatMessages: ChatMessage[];

    public chatMessagesPage: number = 1;
    private readonly chatMessagesPageSize: number = 10;
    public chatMessagesSearch: string = '';
    public allChatMessagesLoaded: boolean = false;

    public readonly defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;

    constructor(
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService);

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.init();
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private init(): void {
        this.initForm();
        super.subscribeToObservable(this.getChatMessagesObservable(this.client.id, this.chatMessagesPage, true, this.chatMessagesSearch));
    }

    searchConversation(search: string): void {
        this.chatMessagesPage = 1;
        this.chatMessagesSearch = search;
        super.subscribeToObservable(this.getChatMessagesObservable(this.client.id, this.chatMessagesPage, true, this.chatMessagesSearch));
    }

    loadMoreMessages(): void {
        super.subscribeToObservable(this.getChatMessagesObservable(this.client.id, this.chatMessagesPage, false, this.chatMessagesSearch));
    }

    private initForm(): void {
                const formConfig = this.dependencies.itemServices.chatMessageService.buildInsertForm()
                    .configField((field, item) => {
                        // manually set recipient & sender
                        if (field.key === 'SenderUserId') {
                            field.value = this.dependencies.authenticatedUserService.getUserId();
                        } else if (field.key === 'RecipientUserId') {
                            field.value = this.client.id;
                        }
                        return Observable.of(field);
                    })
                    .customButtonSaveText(super.translate('module.chat.send'))
                    .wrapInCard(false)
                    .onAfterInsert((response) => {
                        // reload messages
                        super.subscribeToObservable(this.getChatMessagesObservable(this.client.id, 1, true, this.chatMessagesSearch)
                            .takeUntil(this.ngUnsubscribe));
                    })
                    .build();

                this.formConfig = formConfig;
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
                        this.chatMessages = _.union(this.chatMessages, response.items);
                    }
                } else {
                    if (replaceMessages) {
                        this.chatMessages = [];
                    }
                    this.allChatMessagesLoaded = true;
                }
            });
    }
}
