import { MenuItem, MenuItemType } from '../../core';
import { UrlConfig } from 'app/config';

export class MyProfileMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, UrlConfig.Dashboard, { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.profile.submenu.editProfile' }, MenuItemType.auth, 'profile/edit', { icon: 'edit' }),
            new MenuItem({ key: 'module.profile.submenu.avatar' }, MenuItemType.auth, 'profile/avatar', { icon: 'photo_camera' }),
            new MenuItem({ key: 'module.profile.submenu.feeds' }, MenuItemType.auth, 'profile/feeds', { icon: 'rss_feed' }),
        ];
    }
}





