// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from './base/base-type.service';

// required by service
import { User, UserFilterWithCount } from '../models';
import { EditFormQuery, RepositoryClient, MultipleItemQuery, CreateItemQuery, ResponseSingle, MultipleItemQueryCustom } from '../../lib/repository';
import { DynamicFormEditBuilder } from '../../web-components/dynamic-form';

@Injectable()
export class UserService extends BaseTypeService<User> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'User',
            allowDelete: true
        });
    }

    myProfileForm(): DynamicFormEditBuilder<User> {
        const myProfileFormQuery = super.editFormQuery(-1).withCustomAction('GetMyProfileForm');

        return super.editForm(myProfileFormQuery);
    }

    clients(): MultipleItemQuery<User> {
        return super.items().withCustomAction('getClients');
    }

    clientsCount(): MultipleItemQuery<User> {
        return super.items().withCustomAction('getClients');
    }

    createClient(item: User): CreateItemQuery<User> {
        return super.create(item).withCustomAction('createClient');
    }

    getAuthUser(): Observable<ResponseSingle<User>> {
        return super.item().withCustomAction('getAuthUser').get();
    }

}
