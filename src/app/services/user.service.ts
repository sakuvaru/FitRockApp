// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from '../core';

// required by service
import { User } from '../models';

import { RepositoryClient, MultipleItemQuery, CreateItemQuery } from '../../lib/repository';


@Injectable()
export class UserService extends BaseTypeService<User>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, "user")
    }

    clients(): MultipleItemQuery<User> {
        return this.items().withCustomAction('getclients');
    }

    createClient(item: User): CreateItemQuery<User> {
        return this.create(item).withCustomAction('createClient');
    }
}