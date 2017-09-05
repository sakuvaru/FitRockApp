import { AppConfig } from '../config/app.config';
import { MenuItem, MenuItemType, ResourceKey } from '../models/core.models';

export class AdminMenu {

    private readonly mainMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, MenuItemType.trainer, '', { icon: 'home' }),
        new MenuItem({ key: 'menu.chat' }, MenuItemType.auth, 'chat', { icon: 'email' }),
        new MenuItem({ key: 'menu.clients' }, MenuItemType.trainer, 'clients', { icon: 'people' }),
        new MenuItem({ key: 'menu.workouts' }, MenuItemType.trainer, 'workouts', { icon: 'fitness_center' }),
        new MenuItem({ key: 'menu.exercises' }, MenuItemType.trainer, 'exercises', { icon: 'rowing' }),
        new MenuItem({ key: 'menu.diets' }, MenuItemType.trainer, 'diets', { icon: 'restaurant' }),
        new MenuItem({ key: 'menu.foods' }, MenuItemType.trainer, 'foods', { icon: 'free_breakfast' }),
        new MenuItem({ key: 'menu.progressItemTypes' }, MenuItemType.trainer, 'progress-item-types', { icon: 'timeline' }),
        new MenuItem({ key: 'menu.locations' }, MenuItemType.trainer, 'todo', { icon: 'place' }),
        new MenuItem({ key: 'login' }, MenuItemType.auth, 'login', { icon: 'public' }),
    ];

    private readonly userMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, MenuItemType.trainer, '', { icon: 'home' }),
        new MenuItem({ key: 'menu.clients' }, MenuItemType.trainer, 'clients', { icon: 'people' }),
        new MenuItem({ key: 'menu.workouts' }, MenuItemType.trainer, 'workouts', { icon: 'fitness_center' }),
    ];
}