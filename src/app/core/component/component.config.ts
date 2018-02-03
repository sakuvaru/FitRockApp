import { AppConfig, UrlConfig } from '../../config';
import { MenuItem, MenuItemType, ResourceKey, ComponentAction, RightMenu } from '../models/core.models';
import { IComponentConfig } from './icomponent-config.interface';

export class ComponentConfig implements IComponentConfig {

    private readonly default_componentTitle: ResourceKey = { key: 'menu.dashboard' };
    private readonly default_menuItems: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, MenuItemType.trainer, '', { icon: 'home' }),
    ];
    private readonly default_rightMenu: RightMenu | undefined = undefined;
    private readonly default_menuTitle: ResourceKey = { key: 'menu.main' };
    private readonly default_appName: string = AppConfig.AppName;
    private readonly default_menuAvatarUrl: string = '';
    private readonly default_actions: ComponentAction[] = [];

    public componentTitle?: ResourceKey = this.default_componentTitle;
    public menuItems?: MenuItem[] = this.default_menuItems;
    public rightMenu?: RightMenu = this.default_rightMenu;
    public appName?: string = this.default_appName;
    public menuTitle?: ResourceKey = this.default_menuTitle;
    public enableSearch?: boolean = false;
    public menuAvatarUrl?: string = this.default_menuAvatarUrl;
    public actions?: ComponentAction[] = this.default_actions;

    constructor(options?: {
        componentTitle?: ResourceKey,
        rightMenu?: RightMenu[],
        menuItems?: MenuItem[],
        appName?: string,
        menuTitle?: ResourceKey,
        enableSearch?: boolean,
        menuAvatarUrl?: string,
        actions?: ComponentAction[]
    }) {
        if (options) {
            Object.assign(this, options);
        } 
    }

    setDefaultValues(): void {
        if (!this.componentTitle) {
            this.componentTitle = this.default_componentTitle;
        }
        if (!this.menuItems) {
            this.menuItems = this.default_menuItems;
        }
        if (!this.rightMenu) {
            this.rightMenu = this.default_rightMenu;
        }
        if (!this.appName) {
            this.appName = this.default_appName;
        }
        if (!this.menuTitle) {
            this.menuTitle = this.default_menuTitle;
        }
        if (!this.menuAvatarUrl) {
            this.menuAvatarUrl = this.default_menuAvatarUrl;
        }
        if (!this.actions) {
            this.actions = this.default_actions;
        }
    }
}

