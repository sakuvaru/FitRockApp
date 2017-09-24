// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// responses
import { ResponsePost } from '../../models/responses';

// models
import { CacheKeyType } from '../../models/cache-key-type';

// rxjs
import { Observable } from 'rxjs/Rx';

export class TouchKeyQuery extends BaseQuery {

    private readonly _defaultAction = 'TouchKey';

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        private cacheKeyType: CacheKeyType,
        private itemId?: number
    ) {
        super(authHttp, config)
        this._action = this._defaultAction;
    }

    // url
    protected getPostUrl(): string{
        return this.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponsePost<any>> {
        return super.touchKey(this.getPostUrl(), this.cacheKeyType.toString(), this.itemId);
    }

    // debug

    toString(): string {
        return this.getPostUrl();
    }
}