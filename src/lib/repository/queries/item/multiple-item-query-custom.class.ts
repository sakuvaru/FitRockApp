import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponseMultiple } from '../../models/responses';
import { BaseMultipleItemQuery } from './base-multiple-item-query.class';

export class MultipleItemQueryCustom<TModel> extends BaseMultipleItemQuery {

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

    get(): Observable<ResponseMultiple<TModel>> {
        const url = this.getMultipleItemsQueryUrl();
        return this.queryService.getMultipleCustom(url);
    }

    // debug

    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}
