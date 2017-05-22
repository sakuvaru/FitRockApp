// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RepositoryService } from '../repository/repository.service';
import { BaseService } from '../core/repository-service/base-service.class';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../repository/responses';
import { IService } from '../core/repository-service/iservice.class';
import { IOption } from '../repository/ioption.class';

// required by service
import { User } from '../models/user.class';

@Injectable()
export class UserService extends BaseService<User> implements IService<User>{

    constructor(repositoryService: RepositoryService) {
        super(repositoryService, "user")
    }

    createEmptyItem(): User {
        return new User();
    }

    getClients(options?: IOption[]): Observable<ResponseMultiple<User>> {
        return this.getMultiple('getclients', options);
    }
}