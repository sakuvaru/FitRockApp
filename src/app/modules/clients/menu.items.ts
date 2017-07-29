import { MenuItem, MenuItemType } from '../../core';

export class ClientOverviewMenuItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.clients.allClients' }, 'people', MenuItemType.trainer, 'clients'),
            new MenuItem({ key: 'module.clients.activeClients' }, 'star', MenuItemType.trainer, 'clients/active'),
            new MenuItem({ key: 'module.clients.inactiveClients' }, 'not_interested', MenuItemType.trainer, 'clients/inactive')
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
            new MenuItem({ key: 'Jídelníček' }, 'free_breakfast', MenuItemType.trainer, 'clients/edit/' + id + '/mealplan'),
            new MenuItem({ key: 'Statistiky' }, 'show_chart', MenuItemType.trainer, 'stats'),
            new MenuItem({ key: 'Fotogalerie' }, 'camera', MenuItemType.trainer, 'clients/galllery/' + id),
            new MenuItem({ key: 'Změna údajů' }, 'edit', MenuItemType.trainer, 'clients/edit/' + id)
        ];
    }
}


