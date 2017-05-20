// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RepositoryService } from '../repository/repository.service';
import { BaseService } from '../core/repository-service/base-service.class';
import { ResponseDelete } from '../repository/response-delete.class';
import { ResponseEdit } from '../repository/response-edit.class';
import { ResponseCreate } from '../repository/response-create.class';
import { ResponseSingle } from '../repository/response-single.class';
import { ResponseMultiple } from '../repository/response-multiple.class';
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

    getClients(options?: IOption[]): Observable<User[]> {
        return this.getMultiple('getclients', options);
    }


}