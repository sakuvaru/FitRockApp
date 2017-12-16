import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { ResponseFormInsert } from '../../models/responses';
import { BaseFormQuery } from './base-form-query.class';

export class InsertFormQuery<TItem> extends BaseFormQuery {

    private _defaultAction = 'getInsertForm';

    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService, type);
        this._action = this._defaultAction;
    }

    // execution

    get(): Observable<ResponseFormInsert> {
        return super.runInsertFormQuery();
    }

    // debug

    toString(): string {
        return super.getFormQueryUrl();
    }
}

