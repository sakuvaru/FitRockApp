export class ComponentSetup {

    public initialized: boolean;
    public isNested: boolean;

    constructor(config: {
         initialized: boolean,
         isNested: boolean
    }) {
        Object.assign(this, config);
    }
}
