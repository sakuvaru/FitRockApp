// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from '../core';

// required by service
import { User, UserFilterWithCount } from '../models';

import { RepositoryClient, MultipleItemQuery, CreateItemQuery, ResponseSingle, MultipleItemQueryCustom } from '../../lib/repository';


@Injectable()
export class UserService extends BaseTypeService<User>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'User',
            allowDelete: true
        })
    }

    clients(): MultipleItemQuery<User> {
        return this.items().withCustomAction('getClients');
    }

    createClient(item: User): CreateItemQuery<User> {
        return this.create(item).withCustomAction('createClient');
    }

    getAuthUser(): Observable<ResponseSingle<User>> {
        return this.item().withCustomAction('getAuthUser').get();
    }

     GetUserFiltersCount(firstName: string, lastName: string): MultipleItemQueryCustom<UserFilterWithCount> {
        return this.customItems<UserFilterWithCount>()
            .withCustomOption('firstName', firstName)
            .withCustomOption('lastName', lastName)
            .withCustomAction('GetUserFiltersCount');
    }
}