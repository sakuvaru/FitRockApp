// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../base-query.class';

// models
import { BaseItemQuery } from './base-item-query.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import { ResponseSingle } from '../../models/responses';

// filters
import * as Options from '../../models/options';

// rxjs
import { Observable } from 'rxjs/Rx';

export abstract class BaseSingleItemQuery extends BaseItemQuery {
constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
    ) {
        super(authHttp, config, type);
    }

    // execution
    abstract get(): Observable<ResponseSingle<any>>;

    // debug
    abstract toString(): string;
}

