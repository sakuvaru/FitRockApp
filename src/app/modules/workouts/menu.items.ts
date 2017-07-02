import { MenuItem, MenuItemType } from '../../core';

export class WorkoutsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, ''),
            new MenuItem({ key: 'module.workouts.myTrainingPlans' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
        ];
    }
}

export class WorkoutMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'workouts'),
            new MenuItem({ key: 'module.workouts.view' }, 'info_outline', MenuItemType.trainer, 'workouts/view/' + id),
            new MenuItem({ key: 'module.workouts.editPlan' }, 'list', MenuItemType.trainer, 'workouts/edit-plan/' + id),
            new MenuItem({ key: 'module.workouts.edit' }, 'edit', MenuItemType.trainer, 'workouts/edit/' + id)
        ];
    }
}


