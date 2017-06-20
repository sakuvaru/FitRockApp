// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseFormQuery } from './base-form-query.class';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// responses
import {
    ResponseFormInsert
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class InsertFormQuery extends BaseFormQuery{
    
    private _defaultAction = 'getInsertForm';

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config, type)
        this._action = this._defaultAction;
    }

    // execution

    get(): Observable<ResponseFormInsert> {
        return super.runInsertFormQuery();
    }

    // debug

    toString(): string {
        return super.getFormQueryUrl();
    }
}

