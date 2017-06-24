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
    private _data: any;

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
     * Data to be send in JSON format
     * @param data Json data to be send
     */
    withJsonData(data: any): this {
        this._data = data;
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