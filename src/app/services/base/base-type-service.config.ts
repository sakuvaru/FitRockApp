export class BaseTypeServiceConfig {

    public type: string;
    public allowDelete = false;

    constructor(
        options: {
            type: string,
            allowDelete?: boolean
        }
    ) {
        Object.assign(this, options);
    }
}
