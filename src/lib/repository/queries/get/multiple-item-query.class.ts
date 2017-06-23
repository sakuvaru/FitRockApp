// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// models
import { BaseItemQuery } from './base-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import {
    ResponseDelete, ResponseCreate, ErrorResponse, FormErrorResponse,
    ResponseEdit, ResponseMultiple, ResponseSingle
} from '../../models/responses';

// filters
import * as Options from '../../models/options';

// rxjs
import { Observable } from 'rxjs/Rx';

export class MultipleItemQuery<TItem extends IItem> extends BaseItemQuery<TItem> {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'getAll';

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
        this._action = this.defaultAction;
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    byCurrentUser(): this{
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

    // execution

    get(): Observable<ResponseMultiple<TItem>> {
        return super.runMultipleItemQuery();
    }

    // debug

    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}