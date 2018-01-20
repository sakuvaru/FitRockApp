import { MenuItem, MenuItemType } from '../../core';

export class DietsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.diets.submenu.dietTemplates' }, MenuItemType.trainer, 'diets', { icon: 'restaurant' }),
            new MenuItem({ key: 'module.diets.submenu.clientDiets' }, MenuItemType.trainer, 'diets/client-diets', { icon: 'restaurant' }),
        ];
    }
}

export class NewDietMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'diets', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.diets.submenu.new' }, MenuItemType.trainer, 'diets/new', { icon: 'create' }),
            ];
        }
    }

export class DietMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'diets', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.diets.submenu.view' }, MenuItemType.trainer, 'diets/view/' + id, { icon: 'info_outline' }),
            new MenuItem({ key: 'module.diets.submenu.editPlan' }, MenuItemType.trainer, 'diets/edit-plan/' + id, { icon: 'list' }),
            new MenuItem({ key: 'module.diets.submenu.edit' }, MenuItemType.trainer, 'diets/edit/' + id, { icon: 'edit' })
        ];
    }
}


