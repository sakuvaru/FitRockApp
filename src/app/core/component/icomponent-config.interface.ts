import { ResourceKey, ComponentAction, MenuItem } from 'app/core';

export interface IComponentConfig {

    componentTitle?: ResourceKey;
    menuItems?: MenuItem[];
    appName?: string;
    menuTitle?: ResourceKey;
    enableSearch?: boolean;
    menuAvatarUrl?: string;
    actions?: ComponentAction[];
}
