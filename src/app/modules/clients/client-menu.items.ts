import { MenuItem, MenuItemType } from '../../core';

export class ClientMenuItems {

    menuItems: MenuItem[];

    constructor(id: number) {
        this.menuItems = [
            new MenuItem({ key: 'Zpět' }, 'home', MenuItemType.trainer, ''),
            new MenuItem({ key: 'Profil' }, 'home', MenuItemType.trainer, 'clients/view/' + id),
            new MenuItem({ key: 'Schůzky' }, 'home', MenuItemType.trainer, 'appointments'),
            new MenuItem({ key: 'Tréninky' }, 'home', MenuItemType.trainer, 'trainings'),
            new MenuItem({ key: 'Statistiky' }, 'home', MenuItemType.trainer, 'stats'),
            new MenuItem({ key: 'Zprávy' }, 'home', MenuItemType.trainer, 'messages')
        ];
    }
}


