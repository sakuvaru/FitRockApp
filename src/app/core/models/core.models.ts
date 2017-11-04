export interface IMenuItem {
    menuItems: MenuItem[];
}

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
    public icon?: string;
    public imageUrl?: string;

    constructor(
        public label: ResourceKey,
        public type: MenuItemType,
        public action: string,
        options?: {
            icon?: string,
            imageUrl?: string
        }
    ) {
        if (options) { 
             Object.assign(this, options);
        }
    }
}

export enum MenuItemType {
    auth,
    trainer,
    client
}

export class AuthenticatedUser {
    constructor(
        public id: number,
        public email: string,
        public firstName: string,
        public lastName: string,
        public trainerId: number,
        public isClient: boolean
    ) {}
}

export class GlobalLoaderStatus  {
    constructor(
        /**
         * Indicates if loader should be shown
         */
        public show,
        /**
         * Indicates if loader should be hidden no matter what
         */
        public forceDisable
    ) {}
}


