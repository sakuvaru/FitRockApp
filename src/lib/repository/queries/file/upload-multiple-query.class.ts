import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponseUploadMultiple } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class UploadMultipleQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected controller: string,
        private action: string,
        private files: File[],
    ) {
        super(queryService);
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

        return this.queryService.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseUploadMultiple> {
        if (!this.files || (this.files && this.files.length <= 0)) {
            throw new Error('No files were added to upload query');
        }

        return this.queryService.uploadMultipleFiles(this.getUploadUrl(), this.files);
    }

    // debug

    toString(): string {
        return this.getUploadUrl();
    }
}
