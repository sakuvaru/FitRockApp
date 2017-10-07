// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { IItem } from '../../interfaces/iitem.interface';
import { BaseFormQuery } from './base-form-query.class';
import { IOption } from '../../interfaces/ioption.interface';

// filters
import * as Options from '../../models/options';

// responses
import {
    ResponseFormEdit
} from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class EditFormQuery<TItem extends IItem> extends BaseFormQuery {

    private _defaultAction = 'getEditForm';
    private _disableCache = false;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected itemId: number
    ) {
        super(authHttp, config, type);
        this._action = this._defaultAction;
    }

    // execution
    disableCache(disable: boolean): this {
        this._disableCache = disable;
        return this;
    }

    get(): Observable<ResponseFormEdit<TItem>> {
        return super.runEditFormQuery<TItem>(this.itemId, this._disableCache);
    }

    // debug

    toString(): string {
        return super.getFormQueryUrl();
    }
}

