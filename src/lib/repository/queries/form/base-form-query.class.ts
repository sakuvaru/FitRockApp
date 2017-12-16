import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IItem } from '../../interfaces/iitem.interface';
import { IOption } from '../../interfaces/ioption.interface';
import { ResponseFormEdit, ResponseFormInsert } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export abstract class BaseFormQuery extends BaseQuery {

    protected _options: IOption[] = [];
    protected _action: string;

    /**
    * Extra data send to server
    */
    protected _data: any = {};

    abstract get(): Observable<any>;

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService);
    }

    public withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    public withData(name: string, value: string | boolean | number): this {
        this._data[name] = value;
        return this;
    }

    protected getFormQueryUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action, this._options);
    }

    protected runEditFormQuery<TItem extends IItem>(itemId: number, disableCache?: boolean): Observable<ResponseFormEdit<TItem>> {
        const url = this.getFormQueryUrl();
        return this.queryService.getEditForm<TItem>(url, itemId, disableCache, this._data);
    }

    protected runInsertFormQuery(): Observable<ResponseFormInsert> {
        const url = this.getFormQueryUrl();

        return this.queryService.getInsertForm(url, this._data);
    }
}
