import { MenuItem, MenuItemType } from '../../core';

export class ExercisesOverviewMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.exercises.myExercises' }, MenuItemType.trainer, 'exercises', { icon: 'rowing' }),
            new MenuItem({ key: 'module.exercises.allExercises' }, MenuItemType.trainer, 'exercises/all', { icon: 'list' }),
        ];
    }
}

export class NewExerciseMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'exercises', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.exercises.new' }, MenuItemType.trainer, 'exercises/new', { icon: 'create' }),
            ];
        }
    }

export class ExerciseMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' },MenuItemType.trainer, 'exercises', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.exercises.preview' }, MenuItemType.trainer, 'exercises/preview/' + id, { icon: 'pageview' }),
            new MenuItem({ key: 'module.exercises.edit' }, MenuItemType.trainer, 'exercises/edit/' + id, { icon: 'edit' })
        ];
    }
}

export class ExercisePreviewMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'exercises', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.exercises.preview' }, MenuItemType.trainer, 'exercises/preview/' + id, { icon: 'pageview' })
        ];
    }
}


