import { MenuItem, MenuItemType, IMenuItem } from '../../core';

export class ClientOverviewMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.clients.allClients' }, MenuItemType.trainer, 'clients', { icon: 'people' }),
        ];
    }
}

export class NewClientMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.clients.submenu.newClient' }, MenuItemType.trainer, 'clients/new', { icon: 'create' }),
        ];
    }
}

export class ClientMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients', { icon: 'arrow_back' }),
            new MenuItem({ key: 'Profil' }, MenuItemType.trainer, 'profile', { icon: 'person' }),
            new MenuItem({ key: 'module.clients.submenu.chat' }, MenuItemType.trainer, 'clients/edit/' + id + '/chat', { icon: 'mail' }),
            new MenuItem({ key: 'module.clients.submenu.appointments' }, MenuItemType.trainer, 'clients/edit/' + id + '/appointments', { icon: 'schedule' }),
            new MenuItem({ key: 'module.clients.submenu.workout' }, MenuItemType.trainer, 'clients/edit/' + id + '/workout', { icon: 'fitness_center' }),
            new MenuItem({ key: 'module.clients.submenu.diet' }, MenuItemType.trainer, 'clients/edit/' + id + '/diet', { icon: 'restaurant' }),
            new MenuItem({ key: 'module.clients.submenu.progress' }, MenuItemType.trainer, 'clients/edit/' + id + '/progress', { icon: 'timeline' }),
            new MenuItem({ key: 'module.clients.submenu.stats' },  MenuItemType.trainer, 'clients/edit/' + id + '/stats', { icon: 'show_chart' }),
            new MenuItem({ key: 'module.clients.submenu.gallery' }, MenuItemType.trainer, 'clients/edit/' + id + '/gallery', { icon: 'camera' }),
            new MenuItem({ key: 'module.clients.submenu.editProfile' }, MenuItemType.trainer, 'clients/edit/' + id, { icon: 'edit' })
        ];
    }
}

export class ClientEditWorkoutMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor(clientId: number, workoutId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/workout', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.clients.workout.editPlan' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/workout/' + workoutId + '/workout-plan', { icon: 'list' }),
            new MenuItem({ key: 'module.clients.workout.editWorkout' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/workout/' + workoutId, { icon: 'edit' }),
        ];
    }
}

export class ClientEditAppointmentMenuItems implements IMenuItem {
    
        menuItems: MenuItem[];
    
        constructor(clientId: number, appointmentId: number) {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/appointments', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.clients.appointments.viewAppointment' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/appointments/' + appointmentId + '/view', { icon: 'remove_red_eye' }),
                new MenuItem({ key: 'module.clients.appointments.editAppointment' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/appointments/' + appointmentId, { icon: 'edit' }),
            ];
        }
    }

export class NewClientWorkoutMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor(clientId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/workout', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.clients.workout.newWorkout' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/new-workout', { icon: 'create' }),
        ];
    }
}

export class ClientEditDietMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor(clientId: number, dietId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/diet', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.clients.diet.editPlan' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/diet/' + dietId + '/diet-plan', { icon: 'list' }),
            new MenuItem({ key: 'module.clients.diet.editDiet' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/diet/' + dietId, { icon: 'edit' }),
        ];
    }
}

export class NewClientDietMenuItems implements IMenuItem {

    menuItems: MenuItem[];

    constructor(clientId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/diet', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.clients.diet.newDiet' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/new-diet', { icon: 'create' }),
        ];
    }
}


export class NewClientProgressItemTypeMenuItems implements IMenuItem {
    
        menuItems: MenuItem[];
    
        constructor(clientId: number) {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/diet', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.clients.progress.newProgressItemType' }, MenuItemType.trainer, 'clients/edit/' + clientId + '/new-progress-type', { icon: 'create' }),
            ];
        }
    }


