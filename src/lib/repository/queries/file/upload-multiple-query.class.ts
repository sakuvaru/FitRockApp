// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../common/base-query.class';

// responses
import { IItem } from '../../interfaces/iitem.interface';
import { ResponseUploadMultiple } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class UploadMultipleQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected controller: string,
        private action: string,
        private files: File[],
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
    protected getUploadUrl(): string{

        if (!this._action){
            throw new Error('No action was specified for upload query');
        }

        return super.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseUploadMultiple> {
        if (!this.files || (this.files && this.files.length <= 0)){
            throw new Error('No files were added to upload query')
        }

        return super.uploadMultipleFiles(this.getUploadUrl(), this.files);
    }

    // debug

    toString(): string {
        return this.getUploadUrl();
    }
}