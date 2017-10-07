// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// models
import { FetchedFile } from '../../models/fetched-file.class';

// responses
import { ResponseFileMultiple } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class MultipleFileQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected controller: string,
        protected action: string
    ) {
        super(authHttp, config);
        this._action = action;
    }

    /**
     * Action where file will be uploaded
     * @param action Action URL
     */
    withAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getFileUrl(): string {

        if (!this._action) {
            throw new Error('No action was specified for files query');
        }

        return super.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseFileMultiple> {
        return super.getMultipleFiles(this.getFileUrl());
    }

    // debug

    toString(): string {
        return this.getFileUrl();
    }
}
