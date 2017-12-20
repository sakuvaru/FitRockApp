// service common
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTypeService } from '../base/base-type.service';

// required by service
import { User, UserFilterWithCount } from '../../models';
import { EditFormQuery, RepositoryClient, MultipleItemQuery, CreateItemQuery, ResponseSingle, MultipleItemQueryCustom, ResponsePost } from '../../../lib/repository';
import { DataFormBuilder } from '../../../web-components/data-form';

@Injectable()
export class UserService extends BaseTypeService<User> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'User',
            allowDelete: true
        });
    }

    myProfileForm(): DataFormBuilder<User> {
        const myProfileFormQuery = super.editFormQuery(-1).withCustomAction('GetMyProfileForm');

        return super.buildEditForm(myProfileFormQuery);
    }

    clients(): MultipleItemQuery<User> {
        return super.items().withCustomAction('GetClients');
    }

    saveUserLoginData(gravatarUrl: string, firstName: string, lastName: string, isFemale: boolean): Observable<ResponsePost<any>> {
        return super.post<any>('SaveUserLoginData')
            .withJsonOption('GravatarUrl', gravatarUrl)
            .withJsonOption('FirstName', firstName)
            .withJsonOption('LastName', lastName)
            .withJsonOption('IsFemale', isFemale)
            .set();
    }

    createClient(item: User): CreateItemQuery<User> {
        return super.create(item).withCustomAction('createClient');
    }

    getAuthUser(): Observable<ResponseSingle<User>> {
        return super.item().withCustomAction('getAuthUser').get();
    }

    createAccount(email: string, password: string): Observable<ResponsePost<any>> {
        return super.post<any>('CreateAccount')
            .withJsonOption('Email', email)
            .withJsonOption('Password', password)
            .set();
    }

}
