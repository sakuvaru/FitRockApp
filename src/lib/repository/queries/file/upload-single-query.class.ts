// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// responses
import { IItem } from '../../interfaces/iitem.interface';
import { ResponseUploadSingle } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class UploadSingleQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected controller: string,
        private action: string,
        private file: File,
    ) {
        super(authHttp, config);
        this._action = this.action;
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
    protected getUploadUrl(): string {

        if (!this._action) {
            throw new Error('No action was specified for upload query');
        }

        return super.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseUploadSingle> {
        if (!this.file) {
            throw new Error('No file was added to upload query');
        }

        return super.uploadSingleFile(this.getUploadUrl(), this.file);
    }

    // debug

    toString(): string {
        return this.getUploadUrl();
    }
}
