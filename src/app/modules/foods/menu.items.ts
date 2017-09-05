import { MenuItem, MenuItemType } from '../../core';

export class FoodOverviewItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.foods.submenu.myFoods' }, MenuItemType.trainer, 'foods', { icon: 'free_breakfast' }),
            new MenuItem({ key: 'module.foods.submenu.allFoods' }, MenuItemType.trainer, 'foods/all', { icon: 'list' }),
        ];
    }
}

export class NewFoodMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.foods.submenu.new' }, MenuItemType.trainer, 'foods/new', { icon: 'create' }),
            ];
        }
    }

export class FoodMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.preview' },  MenuItemType.trainer, 'foods/preview/' + foodId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.foods.submenu.edit' }, MenuItemType.trainer, 'foods/edit/' + foodId, { icon: 'edit' })
        ];
    }
}

export class FoodPreviewMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.preview' }, MenuItemType.trainer, 'foods/preview/' + foodId, { icon: 'pageview' })
        ];
    }
}


