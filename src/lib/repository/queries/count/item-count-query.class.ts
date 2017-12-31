import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { ResponseCount } from '../../models/responses';
import { BaseItemCountQuery } from './base-item-count-query.class';

export class ItemCountQuery extends BaseItemCountQuery {

    private readonly defaultAction: string = 'GetCount';

    /**
     * Action used for getting count of items created by current user
     */
    private readonly createdByCurrentUserCountAction = 'getCountCreatedByCurrentUser';

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService, type);
        this._action = this.defaultAction;
    }
    
    byCurrentUser(): this {
        this._action = this.createdByCurrentUserCountAction;
        return this;
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

