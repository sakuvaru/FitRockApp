export interface IMenuItems{
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

export class AuthenticatedUser{
    constructor(
        public id: number,
        public email: string,
        public firstName: string,
        public lastName: string,
        public trainerId: number
    ){}
}