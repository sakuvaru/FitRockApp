import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseMultiple } from '../../models/responses';
import { BaseMultipleItemQuery } from './base-multiple-item-query.class';

export class MultipleItemQuery<TItem extends IItem> extends BaseMultipleItemQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'getAll';

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService, type);
        this._action = this.defaultAction;
    }

    // execution
    get(): Observable<ResponseMultiple<TItem>> {
        const url = this.getMultipleItemsQueryUrl();
        return this.queryService.getMultiple(url);
    }

    // debug
    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}
