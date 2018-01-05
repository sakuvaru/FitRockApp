import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { IItem } from '../../interfaces/iitem.interface';
import * as Options from '../../models/options';
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


    include(field: string): this {
        this._options.push(new Options.Include(field));
        return this;
    }

    includeMultiple(fields: string[]): this {
        this._options.push(new Options.IncludeMultiple(fields));
        return this;
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

