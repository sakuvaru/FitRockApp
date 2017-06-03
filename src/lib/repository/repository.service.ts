import { Injectable } from '@angular/core';
import { BaseRepositoryService } from './base-repository-service';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from './models/responses';
import { IOption } from './interfaces/ioption.interface';
import { IItem } from './interfaces/iitem.interface';
import { AuthHttp } from 'angular2-jwt';
import { RepositoryConfig } from './repository.config';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class RepositoryService extends BaseRepositoryService {

    constructor(
       protected authHttp: AuthHttp,
       protected config: RepositoryConfig
    ) { super(authHttp, config) }

    getItems<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseMultiple<TItem>> {
        return super.getMultiple(type, action, options);
    }

    getItem<TItem extends IItem>(type: string, action: string, options?: IOption[]): Observable<ResponseSingle<TItem>> {
        return super.getSingle(type, action, options);
    }

    create<TItem extends IItem>(type: string, action: string, obj: TItem): Observable<ResponseCreate<TItem>> {
        return super.create<TItem>(type, action, obj);
    }

    edit<TItem extends IItem>(type: string, action: string, obj: TItem): Observable<ResponseEdit<TItem>> {
        return super.edit<TItem>(type, action, obj);
    }

    delete<TItem extends IItem>(type: string, action: string): Observable<ResponseDelete> {
        return super.delete(type, action);
    }
}


