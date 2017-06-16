// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from '../core';

// required by service
import { User } from '../models';

import { MultipleItemQuery, RepositoryClient, IncludeMultiple, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../lib/repository';


@Injectable()
export class UserService extends BaseTypeService<User>{

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, "user")
    }

    createEmptyItem(): User {
        return new User();
    }

    clients(): MultipleItemQuery<User> {
        return this.items().withCustomAction('getclients');
    }

    createClient(obj: User): Observable<ResponseCreate<User>> {
        return this.createCustom('createClient', obj);
    }
}