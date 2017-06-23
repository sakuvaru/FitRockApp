import { MenuItem, MenuItemType } from '../../core';

export class WorkoutsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, ''),
            new MenuItem({ key: 'menu.workouts.list' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
        ];
    }
}

export class WorkoutMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'workouts'),
            new MenuItem({ key: 'menu.workouts.view' }, 'view', MenuItemType.trainer, 'workouts/view/id/' + id),
            new MenuItem({ key: 'menu.workouts.edit' }, 'build', MenuItemType.trainer, 'workouts/edit/' + id)
        ];
    }
}


