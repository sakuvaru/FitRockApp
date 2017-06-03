import { TypeResolver } from './type-resolver.class';

export class RepositoryConfig {

    public logErrorsToConsole: boolean = true;

    constructor(
        public apiUrl: string,
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