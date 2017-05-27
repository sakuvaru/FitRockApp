// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RepositoryService } from '../repository/repository.service';
import { BaseTypeService } from '../core/type-service/base-type.service';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../repository/responses';
import { IOption } from '../repository/ioption.interface';
import { IncludeMultiple } from '../repository/options.class';

// required by service
import { User } from '../models/user.class';

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