// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseSingleItemQuery } from './base-single-item-query.class';

// responses
import { ResponseSingle } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleItemQueryCustom<TModel> extends BaseSingleItemQuery {

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
    get(): Observable<ResponseSingle<TModel>> {
        const url = super.getSingleItemQueryUrl();
        return super.getSingleCustom(url);
    }

    // debug
    toString(): string {
        return super.getSingleItemQueryUrl();
    }
}

export class SingleItemQueryInitCustom<TModel> {
    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
    }

    byId(id: number): SingleItemQueryCustom<TModel> {
        const action = 'getbyid/' + id;

        return new SingleItemQueryCustom(this.authHttp, this.config, this.type, action);
    }

    withCustomAction(action: string): SingleItemQueryCustom<TModel> {
        return new SingleItemQueryCustom(this.authHttp, this.config, this.type, action);
    }
}

