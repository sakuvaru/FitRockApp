import { MenuItem, MenuItemType } from '../../core';

export class ClientOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, 'arrow_back', MenuItemType.trainer, ''),
            new MenuItem({ key: 'menu.clients.allClients' }, 'people', MenuItemType.trainer, 'clients'),
            new MenuItem({ key: 'menu.clients.activeClients' }, 'star', MenuItemType.trainer, 'clients/active'),
            new MenuItem({ key: 'menu.clients.inactiveClients' }, 'not_interested', MenuItemType.trainer, 'clients/inactive')
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
            new MenuItem({ key: 'Trénink' }, 'fitness_center', MenuItemType.trainer, 'trainings'),
            new MenuItem({ key: 'Jídelníček' }, 'free_breakfast', MenuItemType.trainer, 'trainings'),
            new MenuItem({ key: 'Statistiky' }, 'show_chart', MenuItemType.trainer, 'stats'),
            new MenuItem({ key: 'Fotogalerie' }, 'camera', MenuItemType.trainer, 'clients/galllery/' + id),
            new MenuItem({ key: 'Změna údajů' }, 'build', MenuItemType.trainer, 'clients/edit/' + id)
        ];
    }
}


