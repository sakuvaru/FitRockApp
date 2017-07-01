// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// models
import { BaseItemQuery } from './base-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import {
    ResponseDelete, ResponseCreate, ErrorResponse, FormErrorResponse,
    ResponseEdit, ResponseMultiple, ResponseSingle
} from '../../models/responses';

// filters
import * as Options from '../../models/options';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleItemQuery<TItem extends IItem> extends BaseItemQuery<TItem> {

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected action: string
    ) {
        super(authHttp, config, type)
        this._action = action;
    }

    // execution

    get(): Observable<ResponseSingle<TItem>> {
        return super.runSingleItemQuery();
    }

    // debug

    toString(): string {
        return super.getSingleItemQueryUrl();
    }
}

export class SingleItemQueryInit<TItem extends IItem> {
    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
    }

    byId(id: number): SingleItemQuery<TItem> {
        var action = 'getbyid/' + id;

        return new SingleItemQuery(this.authHttp, this.config, this.type, action)
    }

    withCustomAction(action: string): SingleItemQuery<TItem> {
        return new SingleItemQuery(this.authHttp, this.config, this.type, action)
    }
}