export class ResourceKey {

    public key: string;
    public data?: any;

    constructor(
        options: {
            key: string,
            data?: any
        }
    ) {
        Object.assign(this, options);
    }
}

export class MenuItem {
    constructor(
        public label: ResourceKey,
        public icon: string,
        public type: MenuItemType,
        public action: string
    ) {
    }
}

export enum MenuItemType {
    auth,
    trainer,
    client
}