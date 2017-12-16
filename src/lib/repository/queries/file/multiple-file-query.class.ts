import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { ResponseFileMultiple } from '../../models/responses';
import { BaseQuery } from '../base-query.class';

export class MultipleFileQuery extends BaseQuery {

    private _action: string;

    constructor(
        protected queryService: QueryService,
        protected controller: string,
        protected action: string
    ) {
        super(queryService);
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

        return this.queryService.getGenericUrl(this.controller, this._action);
    }

    // execution

    set(): Observable<ResponseFileMultiple> {
        return this.queryService.getMultipleFiles(this.getFileUrl());
    }

    // debug

    toString(): string {
        return this.getFileUrl();
    }
}
