import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponsePost } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class PostQuery<T extends any> extends BaseQuery {

    private _action: string;
    private _data: any = {};

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected action: string
    ) {
        super(queryService);
        this._action = this.action;
    }

    /**
     * Data to be send in JSON format.
     * Should not be combined with 'withJsonOption' method as it will
     * override the changes
     * @param data Json data to be send
     */
    withJsonData(data: any): this {
        this._data = data;
        return this;
    }

    /**
     * Sets field & value. Should not be combined with 'withJsonData' method
     * as it could override its data
     * @param field Name of the field in JSON body
     * @param value Value of the field
     */
    withJsonOption(field: string, value: any): this {
        this._data[field] = value;
        return this;
    }

    // url
    protected getPostUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponsePost<T>> {
        return this.queryService.post(this.getPostUrl(), this._data);
    }

    // debug

    toString(): string {
        return this.getPostUrl();
    }
}
