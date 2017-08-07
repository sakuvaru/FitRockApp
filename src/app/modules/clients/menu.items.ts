import { MenuItem, MenuItemType } from '../../core';

export class ClientOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.clients.allClients' }, 'people', MenuItemType.trainer, 'clients'),
        ];
    }
}

export class ClientMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'clients'),
            new MenuItem({ key: 'Profil' }, 'person', MenuItemType.trainer, 'profile'),
            new MenuItem({ key: 'Zprávy' }, 'mail', MenuItemType.trainer, 'messages'),
            new MenuItem({ key: 'Schůzky' }, 'schedule', MenuItemType.trainer, 'appointments'),
            new MenuItem({ key: 'module.clients.submenu.workout' }, 'fitness_center', MenuItemType.trainer, 'clients/edit/' + id + '/workout'),
            new MenuItem({ key: 'module.clients.submenu.diet' }, 'restaurant', MenuItemType.trainer, 'clients/edit/' + id + '/diet'),
            new MenuItem({ key: 'Statistiky' }, 'show_chart', MenuItemType.trainer, 'stats'),
            new MenuItem({ key: 'Fotogalerie' }, 'camera', MenuItemType.trainer, 'clients/galllery/' + id),
            new MenuItem({ key: 'Změna údajů' }, 'edit', MenuItemType.trainer, 'clients/edit/' + id)
        ];
    }
}

export class ClientEditWorkoutMenuItems {

    menuItems: MenuItem[];

    constructor(clientId: number, workoutId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'clients/edit/' + clientId + '/workout'),
            new MenuItem({ key: 'module.clients.workout.editPlan' }, 'list', MenuItemType.trainer, 'clients/edit/' + clientId + '/workout/' + workoutId + '/workout-plan'),
            new MenuItem({ key: 'module.clients.workout.editWorkout' }, 'edit', MenuItemType.trainer, 'clients/edit/' + clientId + '/workout/' + workoutId),
        ];
    }
}

export class ClientEditDietMenuItems {

    menuItems: MenuItem[];

    constructor(clientId: number, dietId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, 'clients/edit/' + clientId + '/diet'),
            new MenuItem({ key: 'module.clients.diet.editPlan' }, 'list', MenuItemType.trainer, 'clients/edit/' + clientId + '/diet/' + dietId + '/diet-plan'),
            new MenuItem({ key: 'module.clients.diet.editDiet' }, 'edit', MenuItemType.trainer, 'clients/edit/' + clientId + '/diet/' + dietId),
        ];
    }
}


