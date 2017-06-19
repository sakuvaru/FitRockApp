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
    ResponseForm
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class EditFormQuery extends BaseFormQuery{

    private _defaultAction = 'getEditForm';

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected itemId: number
    ) {
        super(authHttp, config, type)
        this._action = this._defaultAction + '/' + itemId;
    }

    // execution

    get(): Observable<ResponseForm> {
        return super.runFormQuery();
    }

    // debug

    toString(): string {
        return super.getFormQueryUrl();
    }
}

