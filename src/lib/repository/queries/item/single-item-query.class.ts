// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseSingleItemQuery } from './base-single-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import { ResponseSingle } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleItemQuery<TItem extends IItem> extends BaseSingleItemQuery {

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected action: string
    ) {
        super(authHttp, config, type);
        this._action = action;
    }

    // execution

    get(): Observable<ResponseSingle<TItem>> {
        const url = super.getSingleItemQueryUrl();
        return this.queryService.getSingle(url);
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
        const action = 'getbyid/' + id;

        return new SingleItemQuery(this.authHttp, this.config, this.type, action);
    }

    withCustomAction(action: string): SingleItemQuery<TItem> {
        return new SingleItemQuery(this.authHttp, this.config, this.type, action);
    }
}

