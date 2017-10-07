export class ComponentSetup {

    public initialized: boolean;

    constructor(config: {
         initialized: boolean
    }) { 
        Object.assign(this, config);
    }
}