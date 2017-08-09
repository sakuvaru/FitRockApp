import { Injectable } from '@angular/core';
import { ProgressItemType } from '../../models';
import { RepositoryClient } from '../../../lib/repository';
import { BaseTypeService } from '../../core';

@Injectable()
export class ProgressItemTypeService extends BaseTypeService<ProgressItemType>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ProgressItemType',
            allowDelete: true
        })
    }
}