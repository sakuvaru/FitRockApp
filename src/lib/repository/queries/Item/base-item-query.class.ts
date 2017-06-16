// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseQuery } from '../common/base-query.class';
import { IItem } from '../../interfaces/iitem.interface';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// responses
import {
    ResponseDelete, ResponseCreate, ErrorResponse, FormErrorResponse,
    ResponseEdit, ResponseMultiple, ResponseSingle
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseItemQuery<TItem extends IItem> extends BaseQuery {

    protected _options: IOption[] = [];
    protected _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config)
    }

    // options

    include(field: string): this {
        this._options.push(new Options.Include(field));
        return this;
    }

    includeMultiple(fields: string[]): this {
        this._options.push(new Options.IncludeMultiple(fields));
        return this;
    }

    whereEquals(field: string, value: string): this {
        this._options.push(new Options.WhereEquals(field, value));
        return this;
    }

    whereLike(field: string, value: string): this {
        this._options.push(new Options.WhereLike(field, value));
        return this;
    }

    WhereLikeMultiple(fields: string[], value: string): this {
        this._options.push(new Options.WhereLikeMultiple(fields, value));
        return this;
    }

    protected getSingleItemQueryUrl(): string {
        return this.getUrl(this.type, this._action, this._options);
    }

    protected runSingleItemQuery(): Observable<ResponseSingle<TItem>> {
        var url = this.getSingleItemQueryUrl();

        return super.getSingle<TItem>(url);
    }

    protected getMultipleItemsQueryUrl(): string {
        return this.getUrl(this.type, this._action, this._options);
    }

    protected runMultipleItemQuery(): Observable<ResponseMultiple<TItem>> {
        var url = this.getMultipleItemsQueryUrl();

        return super.getMultiple(url);
    }
}