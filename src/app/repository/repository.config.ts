import { TypeResolver } from './type-resolver.class';

export class RepositoryConfig{
    constructor(
        public apiUrl: string,
        public typeResolvers: TypeResolver[]
    ){
    }
}