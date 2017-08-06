import { MenuItem, MenuItemType } from '../../core';

export class DietsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.diets.submenu.dietTemplates' }, 'restaurant', MenuItemType.trainer, 'diets'),
            new MenuItem({ key: 'module.diets.submenu.allDiets' }, 'restaurant', MenuItemType.trainer, 'diets/all'),
        ];
    }
}

export class DietMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'diets'),
            new MenuItem({ key: 'module.diets.submenu.view' }, 'info_outline', MenuItemType.trainer, 'diets/view/' + id),
            new MenuItem({ key: 'module.diets.submenu.editPlan' }, 'list', MenuItemType.trainer, 'diets/edit-plan/' + id),
            new MenuItem({ key: 'module.diets.submenu.edit' }, 'edit', MenuItemType.trainer, 'diets/edit/' + id)
        ];
    }
}


