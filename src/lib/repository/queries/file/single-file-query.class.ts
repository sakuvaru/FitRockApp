// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../base-query.class';

// models
import { FetchedFile } from '../../models/fetched-file.class';

// responses
import { ResponseFileSingle } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class SingleFileQuery extends BaseQuery {

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
            throw new Error('No action was specified for file query');
        }

        return this.queryService.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseFileSingle> {
        return this.queryService.getSingleFile(this.getFileUrl());
    }

    // debug

    toString(): string {
        return this.getFileUrl();
    }
}
