import { AppConfig } from '../config/app.config';
import { MenuItem, MenuItemType, ResourceKey } from '../models/core.models';

export class ComponentConfig {

    private readonly default_componentTitle: ResourceKey = { key: 'menu.dashboard' };
    private readonly default_menuItems: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, MenuItemType.trainer, '', { icon: 'home' }),
    ];
    private readonly default_menuTitle: ResourceKey = { key: 'menu.main' };
    private readonly default_appName: string = AppConfig.AppName;
    private readonly default_menuAvatarUrl: string = '';

    public componentTitle?: ResourceKey = this.default_componentTitle;
    public menuItems?: MenuItem[] = this.default_menuItems;
    public appName?: string = this.default_appName;
    public menuTitle?: ResourceKey = this.default_menuTitle;
    public enableSearch: boolean = false;
    public autoInitComponent: boolean = false;
    public menuAvatarUrl?: string = this.default_menuAvatarUrl;

    constructor(options?: {
        componentTitle?: ResourceKey,
        menuItems?: MenuItem[],
        appName?: string,
        menuTitle?: ResourceKey,
        enableSearch?: boolean,
        autoInitComponent?: boolean,
        menuAvatarUrl?: string

    }) {
        if (options) Object.assign(this, options);
    }

    setDefaultValues(): void {
        if (!this.componentTitle) {
            this.componentTitle = this.default_componentTitle;
        }
        if (!this.menuItems) {
            this.menuItems = this.default_menuItems;
        }
        if (!this.appName) {
            this.appName = this.default_appName;
        }
        if (!this.menuTitle) {
            this.menuTitle = this.default_menuTitle;
        }
        if (!this.menuAvatarUrl){
            this.menuAvatarUrl = this.default_menuAvatarUrl
        }
    }
}

