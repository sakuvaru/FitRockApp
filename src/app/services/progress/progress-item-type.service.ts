import { Injectable } from '@angular/core';
import { ProgressItemType, ProgressItemTypeWithCountDto } from '../../models';
import { RepositoryClient, MultipleItemQueryCustom } from '../../../lib/repository';
import { BaseTypeService } from '../../core';

@Injectable()
export class ProgressItemTypeService extends BaseTypeService<ProgressItemType>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ProgressItemType',
            allowDelete: true
        })
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