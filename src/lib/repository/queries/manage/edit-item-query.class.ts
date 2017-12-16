import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseEdit } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class EditItemQuery<TItem extends IItem> extends BaseQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'edit';

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected formData: Object
    ) {
        super(queryService);
        this._action = this.defaultAction;
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getEditUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponseEdit<TItem>> {
        return this.queryService.edit(this.getEditUrl(), this.formData);
    }

    // debug

    toString(): string {
        return this.getEditUrl();
    }
}
