// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseItemCountQuery } from './base-item-count-query.class';

// responses
import { ResponseCount } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class ItemCountQuery extends BaseItemCountQuery {

    private readonly defaultAction: string = 'GetCount';

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config, type);
        this._action = this.defaultAction;
    }

    // execution
    get(): Observable<ResponseCount> {
        const url = super.getQueryUrl();
        return this.queryService.getCount(url);
    }

    // debug
    toString(): string {
        return super.getQueryUrl();
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }
}

