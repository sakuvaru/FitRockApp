// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from '../core';

// required by service
import { User } from '../models';

import { RepositoryService, IOption, IncludeMultiple, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../lib/repository.lib';


@Injectable()
export class UserService extends BaseTypeService<User>{

    constructor(repositoryService: RepositoryService) {
        super(repositoryService, "user")
    }

    createEmptyItem(): User {
        return new User();
    }

    getClients(options?: IOption[]): Observable<ResponseMultiple<User>> {

        options.push(new IncludeMultiple(["trainer"]));

        return this.getMultiple('getclients', options);
    }

    createClient(obj: User): Observable<ResponseCreate<User>> {
        return this.createCustom('createClient', obj);
    }
}