import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseFormEdit } from '../../models/responses';
import { BaseFormQuery } from './base-form-query.class';

export class EditFormQuery<TItem extends IItem> extends BaseFormQuery {

    private _defaultAction = 'getEditForm';
    private _disableCache = false;

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected itemId: number
    ) {
        super(queryService, type);
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

