import { MenuItem, MenuItemType } from '../../core';

export class WorkoutsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.workouts.submenu.workoutTemplates' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
            new MenuItem({ key: 'module.workouts.submenu.allWorkouts' }, 'fitness_center', MenuItemType.trainer, 'workouts/all'),
        ];
    }
}

export class NewWorkoutMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'workouts'),
                new MenuItem({ key: 'module.workouts.submenu.new' }, 'create', MenuItemType.trainer, 'workouts/new'),
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


