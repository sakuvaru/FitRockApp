// config
import { RepositoryConfig } from '../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { QueryService } from '../services/query.service';

export abstract class BaseQuery {

    protected queryService: QueryService;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        this.queryService = new QueryService(authHttp, config);
    }

    abstract toString(): string;
}