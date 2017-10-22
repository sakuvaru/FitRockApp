// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { BaseMultipleItemQuery } from './base-multiple-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import { ResponseMultiple } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class MultipleItemQueryCustom<TModel> extends BaseMultipleItemQuery {

    /**
     * Default action that will be called on server if none custom is specified
     */
    private readonly defaultAction = 'getAll';


    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config, type);
        this._action = this.defaultAction;
    }

    // execution

    get(): Observable<ResponseMultiple<TModel>> {
        const url = this.getMultipleItemsQueryUrl();
        return this.queryService.getMultipleCustom(url);
    }

    // debug

    toString(): string {
        return super.getMultipleItemsQueryUrl();
    }
}
