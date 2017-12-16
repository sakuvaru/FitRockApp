import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import * as Options from '../../models/options';
import { ResponseMultiple } from '../../models/responses';
import { ItemCountQuery } from '../count/item-count-query.class';
import { BaseItemQuery } from './base-item-query.class';

export abstract class BaseMultipleItemQuery extends BaseItemQuery {

    /**
     * Action used for getting items created by current user
     */
    private readonly createdByCurrentUserAction = 'getCreatedByCurrentUser';

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService, type);
    }

    // execution
    abstract get(): Observable<ResponseMultiple<any>>;

    toCountQuery(): ItemCountQuery {
        const countQuery = new ItemCountQuery(this.queryService, this.type);

        this._options.forEach(option => {
            countQuery.addOption(option);
        });

        return countQuery;
    }

    // debug
    abstract toString(): string;

    withCustomOption(optionName: string, value: string | boolean | number | Date): this {
        this._options.push(new Options.CustomOption(optionName, value));
        return this;
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    byCurrentUser(): this {
        this._action = this.createdByCurrentUserAction;
        return this;
    }

    // options

    page(page: number): this {
        this._options.push(new Options.Page(page));
        return this;
    }

    limit(limit: number): this {
        this._options.push(new Options.Limit(limit));
        return this;
    }

    pageSize(pageSize: number): this {
        this._options.push(new Options.PageSize(pageSize));
        return this;
    }

    orderByAsc(field: string): this {
        this._options.push(new Options.OrderBy(field));
        return this;
    }

    orderByDesc(field: string): this {
        this._options.push(new Options.OrderByDescending(field));
        return this;
    }
}
