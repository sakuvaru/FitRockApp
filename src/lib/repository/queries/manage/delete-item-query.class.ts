import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponseDelete } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class DeleteItemQuery extends BaseQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'delete';

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected itemId: number
    ) {
        super(queryService);
        this._action = this.defaultAction;
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getDeleteUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action + '/' + this.itemId);
    }

    // execution

    set(): Observable<ResponseDelete> {
        return this.queryService.delete(this.getDeleteUrl());
    }

    // debug

    toString(): string {
        return this.getDeleteUrl();
    }
}
