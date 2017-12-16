import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseCreate } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class CreateItemQuery<TItem extends IItem> extends BaseQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'create';

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

    // option
    withOption(fieldName: string, value: number | string | boolean): this {
        this.formData[fieldName] = value;
        return this;
    }

    // url
    protected getCreateUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponseCreate<TItem>> {
        return this.queryService.create(this.getCreateUrl(), this.formData);
    }

    // debug

    toString(): string {
        return this.getCreateUrl();
    }
}
