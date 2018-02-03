import { ResourceKey, ComponentAction, MenuItem, RightMenu } from 'app/core';

export interface IComponentConfig {

    componentTitle?: ResourceKey;
    menuItems?: MenuItem[];
    rightMenu?: RightMenu;
    appName?: string;
    menuTitle?: ResourceKey;
    enableSearch?: boolean;
    menuAvatarUrl?: string;
    actions?: ComponentAction[];
}
