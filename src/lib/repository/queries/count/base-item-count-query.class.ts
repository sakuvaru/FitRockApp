// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseQuery } from '../common/base-query.class';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseItemCountQuery extends BaseQuery {

    protected _options: IOption[] = [];
    protected _action: string;

    abstract get(): any;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config);
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

    WhereLikeMultiple(fields: string[], value: string | number | boolean): this {
        this._options.push(new Options.WhereLikeMultiple(fields, value));
        return this;
    }

    protected getQueryUrl(): string {
        return this.getTypeUrl(this.type, this._action, this._options);
    }
}
