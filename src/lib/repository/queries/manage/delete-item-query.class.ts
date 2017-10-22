// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../base-query.class';

// models
import { IItem } from '../../interfaces/iitem.interface';

// responses
import {
    ResponseDelete, ResponseCreate, ErrorResponse, FormErrorResponse,
    ResponseEdit, ResponseMultiple, ResponseSingle
} from '../../models/responses';

// filters
import * as Options from '../../models/options';

// rxjs
import { Observable } from 'rxjs/Rx';

export class DeleteItemQuery extends BaseQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'delete';

    private _action: string;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        protected itemId: number
    ) {
        super(authHttp, config);
        this._action = this.defaultAction;
    }

    // custom action
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getDeleteUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action + '/' + this.itemId);
    }

    // execution

    set(): Observable<ResponseDelete> {
        return this.queryService.delete(this.getDeleteUrl());
    }

    // debug

    toString(): string {
        return this.getDeleteUrl();
    }
}
