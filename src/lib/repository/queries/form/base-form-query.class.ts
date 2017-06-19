// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseQuery } from '../common/base-query.class';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// responses
import {
    ResponseForm
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseFormQuery extends BaseQuery {

    abstract get(): Observable<ResponseForm>;

    protected _options: IOption[] = [];
    protected _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config)
    }

    protected getFormQueryUrl(): string {
        return this.getUrl(this.type, this._action, this._options);
    }

    protected runFormQuery(): Observable<ResponseForm> {
        var url = this.getFormQueryUrl();

        return super.getForm(url);
    }
}