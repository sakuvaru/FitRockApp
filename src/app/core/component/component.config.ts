import { AppConfig } from '../config/app.config';

export interface IComponentConfig {

    componentTitle?: ResourceKey;
    menuItems?: MenuItem[];
    appName?: string;
    menuTitle?: ResourceKey;
    setDefaultValues?: () => void
}

export class ComponentConfig implements IComponentConfig {

    private readonly default_componentTitle: ResourceKey = { key: 'menu.dashboard' };
    private readonly default_menuItems: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, 'home', MenuItemType.trainer, ''),
        new MenuItem({ key: 'menu.clients' }, 'people', MenuItemType.trainer, 'clients'),
        new MenuItem({ key: 'menu.workouts' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
        new MenuItem({ key: 'menu.exercises' }, 'rowing', MenuItemType.trainer, 'exercises'),
        new MenuItem({ key: 'menu.mealPlans' }, 'free_breakfast', MenuItemType.trainer, 'todo'),
        new MenuItem({ key: 'menu.locations' }, 'place', MenuItemType.trainer, 'todo'),
        new MenuItem({ key: 'login' }, 'public', MenuItemType.auth, 'login'),
    ];
    private readonly default_menuTitle: ResourceKey = { key: 'menu.main' };
    private readonly default_appName: string = AppConfig.AppName;

    public componentTitle?: ResourceKey = this.default_componentTitle;
    public menuItems?: MenuItem[] = this.default_menuItems;
    public appName?: string = this.default_appName;
    public menuTitle?: ResourceKey = this.default_menuTitle;

    constructor(options?: {
        componentTitle?: ResourceKey,
        menuItems?: MenuItem[],
        appName?: string,
        menuTitle?: ResourceKey
    }) {
        if (options) Object.assign(this, options);
    }

    setDefaultValues(): void{
        if (!this.componentTitle){
            this.componentTitle = this.default_componentTitle;
        }
        if (!this.menuItems){
            this.menuItems = this.default_menuItems;
        }
        if (!this.appName){
            this.appName = this.default_appName;
        }
        if (!this.menuTitle){
            this.menuTitle = this.default_menuTitle;
        }
    }
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
