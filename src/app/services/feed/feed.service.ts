import { Injectable } from '@angular/core';
import { Feed } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FeedService extends BaseTypeService<Feed>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'Feed',
            allowDelete: false
        })
    }
}