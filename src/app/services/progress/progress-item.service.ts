import { Injectable } from '@angular/core';
import { ProgressItem } from '../../models';
import { RepositoryClient } from '../../../lib/repository';
import { BaseTypeService } from '../../core';

@Injectable()
export class ProgressItemService extends BaseTypeService<ProgressItem>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'ProgressItem',
            allowDelete: true
        })
    }
}