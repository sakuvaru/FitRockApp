import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { ResponseSingle } from '../../models/responses';
import { BaseItemQuery } from './base-item-query.class';

export abstract class BaseSingleItemQuery extends BaseItemQuery {
constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
        super(queryService, type);
    }

    // execution
    abstract get(): Observable<ResponseSingle<any>>;

    // debug
    abstract toString(): string;
}

