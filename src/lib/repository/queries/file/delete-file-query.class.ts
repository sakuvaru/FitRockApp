import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { ResponseDeleteFile } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class DeleteFileQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected action: string,
        protected controller: string,
        protected fileUrl: string
    ) {
        super(queryService);
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

        return this.queryService.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseDeleteFile> {
        if (!this.fileUrl) {
            throw Error(`File url has to be specified when deleting file`);
        }

        return this.queryService.deleteFile(this.getDeleteUrl(), this.fileUrl);
    }

    // debug

    toString(): string {
        return this.getDeleteUrl();
    }
}
