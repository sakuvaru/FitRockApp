import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { CacheKeyType } from '../../models/cache-key-type';
import { ResponsePost } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class TouchKeyQuery extends BaseQuery {

    private readonly _defaultAction = 'TouchKey';

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected type: string,
        private cacheKeyType: CacheKeyType,
        private itemId?: number
    ) {
        super(queryService);
        this._action = this._defaultAction;
    }

    // url
    protected getPostUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponsePost<any>> {
        return this.queryService.touchKey(this.getPostUrl(), this.cacheKeyType.toString(), this.itemId);
    }

    // debug

    toString(): string {
        return this.getPostUrl();
    }
}
