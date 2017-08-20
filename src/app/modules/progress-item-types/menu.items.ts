import { MenuItem, MenuItemType } from '../../core';

export class ProgressItemTypesOverviewMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.progressItemTypes.submenu.myTypes' }, 'timeline', MenuItemType.trainer, 'progress-item-types'),
            new MenuItem({ key: 'module.progressItemTypes.submenu.allTypes' }, 'timeline', MenuItemType.trainer, 'progress-item-types/all'),
        ];
    }
}

export class NewProgressItemTypeMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'progress-item-types'),
                new MenuItem({ key: 'module.progressItemTypes.submenu.new' }, 'create', MenuItemType.trainer, 'progress-item-types/new'),
            ];
        }
    }

export class ProgressItemMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'progress-item-types'),
            new MenuItem({ key: 'module.progressItemTypes.submenu.edit' }, 'edit', MenuItemType.trainer, 'progress-item-types/edit/' + id)
        ];
    }
}



