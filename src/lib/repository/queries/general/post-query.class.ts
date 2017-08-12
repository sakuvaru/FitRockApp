// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// responses
import { ResponsePost } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class PostQuery<T extends any> extends BaseQuery {

    private _action: string;
    private _data: any = {};

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected action: string
    ) {
        super(authHttp, config)
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
    withJsonOption(field: string, value: any): this{
        this._data[field] = value;
        return this;
    }

    // url
    protected getPostUrl(): string{
        return this.getUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponsePost<T>> {
        return super.post(this.getPostUrl(), this._data);
    }

    // debug

    toString(): string {
        return this.getPostUrl();
    }
}