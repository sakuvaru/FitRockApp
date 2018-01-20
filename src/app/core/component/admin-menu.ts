import { UrlConfig } from '../../config';
import { MenuItem, MenuItemType } from '../models/core.models';

export class AdminMenu {

    public readonly trainerMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.dashboard' }, MenuItemType.trainer, UrlConfig.Dashboard, { icon: 'home' }),
        new MenuItem({ key: 'menu.chat' }, MenuItemType.auth, 'chat', { icon: 'email' }),
        new MenuItem({ key: 'menu.clients' }, MenuItemType.trainer, 'clients', { icon: 'people' }),
        new MenuItem({ key: 'menu.workouts' }, MenuItemType.trainer, 'workouts', { icon: 'fitness_center' }),
        new MenuItem({ key: 'menu.exercises' }, MenuItemType.trainer, 'exercises', { icon: 'rowing' }),
        new MenuItem({ key: 'menu.diets' }, MenuItemType.trainer, 'diets', { icon: 'restaurant' }),
        new MenuItem({ key: 'menu.foods' }, MenuItemType.trainer, 'foods', { icon: 'free_breakfast' }),
        new MenuItem({ key: 'menu.progressItemTypes' }, MenuItemType.trainer, 'progress-item-types', { icon: 'timeline' }),
        new MenuItem({ key: 'menu.locations' }, MenuItemType.trainer, 'locations', { icon: 'place' }),
    ];

    public readonly userMenu: MenuItem[] = [
        new MenuItem({ key: 'menu.editProfile' }, MenuItemType.auth, 'profile/edit', { icon: 'edit' }),
        new MenuItem({ key: 'menu.feeds' }, MenuItemType.auth, 'profile/feeds', { icon: 'notifications' }),
        new MenuItem({ key: 'menu.logout' }, MenuItemType.auth, UrlConfig.Logout, { icon: 'exit_to_app' }),
    ];
}
