import { Injectable } from '@angular/core';
import { ProgressItemType, ProgressItemTypeWithCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class ProgressItemTypeService extends BaseTypeService<ProgressItemType>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ProgressItemType',
            allowDelete: true
        })
    }

    /**
     * Gets types that are global || are created by given user && client id is not set for them
     * @param createdByUserId Id of user who created the type
     */
    getProgressItemTypesSelection(createdByUserId: number): MultipleItemQuery<ProgressItemType>{
        return this.items()
            .withCustomOption('createdByUserId', createdByUserId)
            .withCustomAction('getProgressItemTypesSelection');
    }

     getProgressItemTypeWithCountDto(clientId: number, startDate?: Date): MultipleItemQueryCustom<ProgressItemTypeWithCountDto> {
        var query = this.customItems<ProgressItemTypeWithCountDto>()
            .withCustomOption('ClientId', clientId)
            .withCustomAction('GetProgressItemTypeWithCountDto');

        if (startDate){
            query.withCustomOption('StartDate', startDate)
        }

        return query;
    }
}