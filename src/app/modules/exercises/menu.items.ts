import { MenuItem, MenuItemType } from '../../core';

export class ExercisesOverviewMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.exercises.myExercises' }, 'rowing', MenuItemType.trainer, 'exercises'),
            new MenuItem({ key: 'module.exercises.allExercises' }, 'list', MenuItemType.trainer, 'exercises/all'),
        ];
    }
}

export class NewExerciseMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'exercises'),
                new MenuItem({ key: 'module.exercises.new' }, 'create', MenuItemType.trainer, 'exercises/new'),
            ];
        }
    }

export class ExerciseMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'exercises'),
            new MenuItem({ key: 'module.exercises.preview' }, 'pageview', MenuItemType.trainer, 'exercises/preview/' + id),
            new MenuItem({ key: 'module.exercises.edit' }, 'edit', MenuItemType.trainer, 'exercises/edit/' + id)
        ];
    }
}

export class ExercisePreviewMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'exercises'),
            new MenuItem({ key: 'module.exercises.preview' }, 'pageview', MenuItemType.trainer, 'exercises/preview/' + id)
        ];
    }
}


