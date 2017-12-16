import { QueryService } from 'lib/repository/services/query.service';
import { Observable } from 'rxjs/Rx';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseSingle } from '../../models/responses';
import { BaseSingleItemQuery } from './base-single-item-query.class';

export class SingleItemQuery<TItem extends IItem> extends BaseSingleItemQuery {

    constructor(
        protected queryService: QueryService,
        protected type: string,
        protected action: string
    ) {
        super(queryService, type);
        this._action = action;
    }

    // execution

    get(): Observable<ResponseSingle<TItem>> {
        const url = super.getSingleItemQueryUrl();
        return this.queryService.getSingle(url);
    }

    // debug

    toString(): string {
        return super.getSingleItemQueryUrl();
    }
}

export class SingleItemQueryInit<TItem extends IItem> {
    constructor(
        protected queryService: QueryService,
        protected type: string,
    ) {
    }

    byId(id: number): SingleItemQuery<TItem> {
        const action = 'getbyid/' + id;

        return new SingleItemQuery(this.queryService, this.type, action);
    }

    withCustomAction(action: string): SingleItemQuery<TItem> {
        return new SingleItemQuery(this.queryService, this.type, action);
    }
}

