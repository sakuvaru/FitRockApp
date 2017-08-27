import { MenuItem, MenuItemType } from '../../core';

export class FoodOverviewItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.foods.submenu.myFoods' }, 'free_breakfast', MenuItemType.trainer, 'foods'),
            new MenuItem({ key: 'module.foods.submenu.allFoods' }, 'list', MenuItemType.trainer, 'foods/all'),
        ];
    }
}

export class NewFoodMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'foods'),
                new MenuItem({ key: 'module.foods.submenu.new' }, 'create', MenuItemType.trainer, 'foods/new'),
            ];
        }
    }

export class FoodMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'foods'),
            new MenuItem({ key: 'module.foods.submenu.preview' }, 'pageview', MenuItemType.trainer, 'foods/preview/' + foodId),
            new MenuItem({ key: 'module.foods.submenu.edit' }, 'edit', MenuItemType.trainer, 'foods/edit/' + foodId)
        ];
    }
}

export class FoodPreviewMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'foods'),
            new MenuItem({ key: 'module.foods.submenu.preview' }, 'pageview', MenuItemType.trainer, 'foods/preview/' + foodId)
        ];
    }
}


