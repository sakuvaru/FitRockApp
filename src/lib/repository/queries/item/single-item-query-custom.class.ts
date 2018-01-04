import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { ResponseSingle } from '../../models/responses';
import { BaseSingleItemQuery } from './base-single-item-query.class';

export class SingleItemQueryCustom<TModel> extends BaseSingleItemQuery {

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected action: string
    ) {
        super(queryService, type);
        this._action = action;
    }

    // execution
    get(): Observable<ResponseSingle<TModel>> {
        const url = super.getSingleItemQueryUrl();
        return this.queryService.getSingleCustom(url);
    }

    // debug
    toString(): string {
        return super.getSingleItemQueryUrl();
    }
}

export class SingleItemQueryInitCustom<TModel> {
    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
    }

    byId(id: number): SingleItemQueryCustom<TModel> {
        const action = 'getbyid/' + id;

        return new SingleItemQueryCustom(this.queryService, this.type, action);
    }

    withCustomAction(action: string): SingleItemQueryCustom<TModel> {
        return new SingleItemQueryCustom(this.queryService, this.type, action);
    }
}

