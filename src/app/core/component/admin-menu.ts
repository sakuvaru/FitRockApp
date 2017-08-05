import { AppConfig } from '../config/app.config';
import { MenuItem, MenuItemType, ResourceKey } from '../models/core.models';

export class AdminMenu {

    private readonly mainMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, 'home', MenuItemType.trainer, ''),
        new MenuItem({ key: 'menu.clients' }, 'people', MenuItemType.trainer, 'clients'),
        new MenuItem({ key: 'menu.workouts' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
        new MenuItem({ key: 'menu.exercises' }, 'rowing', MenuItemType.trainer, 'exercises'),
        new MenuItem({ key: 'menu.diets' }, 'free_breakfast', MenuItemType.trainer, 'diets'),
        new MenuItem({ key: 'menu.locations' }, 'place', MenuItemType.trainer, 'todo'),
        new MenuItem({ key: 'login' }, 'public', MenuItemType.auth, 'login'),
    ];

    private readonly userMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, 'home', MenuItemType.trainer, ''),
        new MenuItem({ key: 'menu.clients' }, 'people', MenuItemType.trainer, 'clients'),
        new MenuItem({ key: 'menu.workouts' }, 'fitness_center', MenuItemType.trainer, 'workouts'),
    ];
}