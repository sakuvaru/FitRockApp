import { QueryService } from '../services/query.service';

export abstract class BaseQuery {

    constructor(
        protected queryService: QueryService
    ) {
    }

    abstract toString(): string;
}
