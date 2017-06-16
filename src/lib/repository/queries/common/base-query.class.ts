// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { QueryService } from '../query.service';

export abstract class BaseQuery extends QueryService {

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig
    ) {
        super(authHttp, config)
    }

    abstract toString(): string;
    abstract get(): any;
}