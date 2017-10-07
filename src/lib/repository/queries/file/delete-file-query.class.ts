// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// responses
import { ResponseDeleteFile } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class DeleteFileQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected action: string,
        protected controller: string,
        protected fileUrl: string
    ) {
        super(authHttp, config);
        this._action = action;
    }

    /**
     * Action where file will be deleted
     * @param action Action URL
     */
    withAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getDeleteUrl(): string {
        if (!this._action) {
            throw Error(`No action was specified for delete file query`);
        }

        return super.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseDeleteFile> {
        if (!this.fileUrl) {
            throw Error(`File url has to be specified when deleting file`);
        }

        return super.deleteFile(this.getDeleteUrl(), this.fileUrl);
    }

    // debug

    toString(): string {
        return this.getDeleteUrl();
    }
}
