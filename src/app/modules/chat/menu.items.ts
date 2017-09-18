import { MenuItem, MenuItemType } from '../../core';
import { User } from '../../models';

export class ChatMenuItems {

    menuItems: MenuItem[] = [];

    constructor(users: User[]) {
        users.forEach(user => {
            this.menuItems.push(
                new MenuItem({ key: user.getFullName() }, MenuItemType.auth, 'chat/' + user.id, { imageUrl: 'https://acrossthepondtv.files.wordpress.com/2015/05/kryten.jpg' })
            );
        });
    }
}

