import { MenuItem, MenuItemType } from '../../core';

export class FoodOverviewItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.foods.submenu.myFoods' }, MenuItemType.trainer, 'foods', { icon: 'free_breakfast' }),
            new MenuItem({ key: 'module.foods.submenu.mySupplements' }, MenuItemType.trainer, 'foods/supplements', { icon: 'local_drink' }),
            new MenuItem({ key: 'module.foods.submenu.myMeals' }, MenuItemType.trainer, 'foods/meals', { icon: 'local_dining' }),
            new MenuItem({ key: 'module.foods.submenu.allFoods' }, MenuItemType.trainer, 'foods/all', { icon: 'list' }),
        ];
    }
}

export class NewFoodMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.newFood' }, MenuItemType.trainer, 'foods/new', { icon: 'create' }),
        ];
    }
}

export class NewSupplementMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods/supplements', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.newSupplement' }, MenuItemType.trainer, 'foods/supplements/new', { icon: 'create' }),
        ];
    }
}

export class NewMealMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods/meals', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.newMeal' }, MenuItemType.trainer, 'foods/meals/new', { icon: 'create' }),
        ];
    }
}

export class FoodMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.previewFood' }, MenuItemType.trainer, 'foods/preview/' + foodId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.foods.submenu.editFood' }, MenuItemType.trainer, 'foods/edit/' + foodId, { icon: 'edit' })
        ];
    }
}

export class SupplementMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods/supplements', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.previewSupplement' }, MenuItemType.trainer, 'foods/supplements/preview/' + foodId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.foods.submenu.editSupplement' }, MenuItemType.trainer, 'foods/supplements/edit/' + foodId, { icon: 'edit' })
        ];
    }
}

export class MealMenuItems {

    menuItems: MenuItem[];

    constructor(foodId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'foods/meals', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.foods.submenu.previewMeal' }, MenuItemType.trainer, 'foods/meals/preview/' + foodId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.foods.submenu.editMeal' }, MenuItemType.trainer, 'foods/meals/edit/' + foodId, { icon: 'edit' })
        ];
    }
}


