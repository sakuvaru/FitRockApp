import { IOption } from '../../interfaces/ioption.interface';
import * as Options from '../../models/options';
import { BaseQuery } from '../base-query.class';
import { QueryService } from 'lib/repository/services/query.service';

export abstract class BaseItemCountQuery extends BaseQuery {

    protected _options: IOption[] = [];
    protected _action: string;

    abstract get(): any;

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService);
    }

    // options
    addOption(option: IOption): this {
        this._options.push(option);
        return this;
    }

    disableCache(disableCache: boolean): this {
        this._options.push(new Options.DisableCache(disableCache));
        return this;
    }

    whereEquals(field: string, value: string | number | boolean): this {
        this._options.push(new Options.WhereEquals(field, value));
        return this;
    }

    whereEmpty(field: string): this {
        this._options.push(new Options.WhereEmpty(field));
        return this;
    }

    whereLike(field: string, value: string | number | boolean): this {
        this._options.push(new Options.WhereLike(field, value));
        return this;
    }

    whereLikeMultiple(fields: string[], value: string | number | boolean): this {
        this._options.push(new Options.WhereLikeMultiple(fields, value));
        return this;
    }

    protected getQueryUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action, this._options);
    }
}
