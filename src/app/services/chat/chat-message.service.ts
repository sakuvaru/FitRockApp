import { Injectable } from '@angular/core';
import { ChatMessage } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class ChatMessageService extends BaseTypeService<ChatMessage> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'ChatMessage',
            allowDelete: true
        });
    }


    getConversationMessages(clientId: number): MultipleItemQuery<ChatMessage> {
        return this.items()
            .withCustomOption('ClientId', clientId)
            .withCustomAction('GetConversationMessages');
    }

}
