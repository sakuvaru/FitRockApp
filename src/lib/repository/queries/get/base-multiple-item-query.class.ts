// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// models
import { BaseItemQuery } from './base-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';
import { ItemCountQuery } from '../count/item-count-query.class';

// responses
import { ResponseMultiple } from '../../models/responses';

// options
import * as Options from '../../models/options';
import { IOption } from '../../interfaces/ioption.interface';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseMultipleItemQuery extends BaseItemQuery {

    /**
     * Action used for getting items created by current user
     */
    private readonly createdByCurrentUserAction = 'getCreatedByCurrentUser';

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config, type)
    }

    // execution
    abstract get(): Observable<ResponseMultiple<any>>;

    toCountQuery(): ItemCountQuery{
        var countQuery = new ItemCountQuery(this.authHttp, this.config, this.type);

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