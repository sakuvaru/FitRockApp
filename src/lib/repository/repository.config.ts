import { TypeResolver } from './models/type-resolver.class';

export class RepositoryConfig {

    public logErrorsToConsole: boolean = false;

    constructor(
        public apiUrl: string,
        public typeEndpoint: string,
        public typeResolvers: TypeResolver[],
        options?: {
            logErrorsToConsole: boolean
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}