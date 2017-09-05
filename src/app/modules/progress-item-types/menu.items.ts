import { MenuItem, MenuItemType } from '../../core';

export class ProgressItemTypesOverviewMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.progressItemTypes.submenu.myTypes' }, MenuItemType.trainer, 'progress-item-types', { icon: 'timeline' }),
            new MenuItem({ key: 'module.progressItemTypes.submenu.globalTypes' }, MenuItemType.trainer, 'progress-item-types/global', { icon: 'timeline' }),
        ];
    }
}

export class NewProgressItemTypeMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' },MenuItemType.trainer, 'progress-item-types', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.progressItemTypes.submenu.new' }, MenuItemType.trainer, 'progress-item-types/new', { icon: 'create' }),
            ];
        }
    }

export class ProgressItemMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'progress-item-types', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.progressItemTypes.submenu.edit' }, MenuItemType.trainer, 'progress-item-types/edit/' + id, { icon: 'edit' })
        ];
    }
}



