import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponseUploadSingle } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class UploadSingleQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected controller: string,
        private action: string,
        private file: File,
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

    set(): Observable<ResponseUploadSingle> {
        if (!this.file) {
            throw new Error('No file was added to upload query');
        }

        return this.queryService.uploadSingleFile(this.getUploadUrl(), this.file);
    }

    // debug

    toString(): string {
        return this.getUploadUrl();
    }
}
