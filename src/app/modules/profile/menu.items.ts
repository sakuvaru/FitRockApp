import { MenuItem, MenuItemType } from '../../core';

export class MyProfileMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, ''),
            new MenuItem({ key: 'module.profile.submenu.editProfile' }, 'edit', MenuItemType.auth, 'profile/edit'),
            new MenuItem({ key: 'module.profile.submenu.feeds' }, 'rss_feed', MenuItemType.auth, 'profile/feeds'),
        ];
    }
}





