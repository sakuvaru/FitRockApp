export class ComponentSetup {

    public initialized: boolean;
    public isNested: boolean;
    public disableRepositoryErrors: boolean;

    constructor(config: {
         initialized: boolean,
         isNested: boolean,
         disableRepositoryErrors?: boolean
    }) {
        Object.assign(this, config);
    }
}
