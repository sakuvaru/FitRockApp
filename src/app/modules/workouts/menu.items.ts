import { MenuItem, MenuItemType } from '../../core';

export class WorkoutsOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.workouts.submenu.workoutTemplates' }, MenuItemType.trainer, 'workouts', { icon: 'fitness_center' }),
            new MenuItem({ key: 'module.workouts.submenu.clientWorkouts' }, MenuItemType.trainer, 'workouts/client-workouts', { icon: 'fitness_center' }),
        ];
    }
}

export class NewWorkoutMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' },MenuItemType.trainer, 'workouts', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.workouts.submenu.new' }, MenuItemType.trainer, 'workouts/new', { icon: 'create' }),
            ];
        }
    }

export class WorkoutMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'workouts', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.workouts.view' }, MenuItemType.trainer, 'workouts/view/' + id, { icon: 'info_outline' }),
            new MenuItem({ key: 'module.workouts.editPlan' }, MenuItemType.trainer, 'workouts/edit-plan/' + id, { icon: 'list' }),
            new MenuItem({ key: 'module.workouts.edit' }, MenuItemType.trainer, 'workouts/edit/' + id, { icon: 'edit' })
        ];
    }
}


