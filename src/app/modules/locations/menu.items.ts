import { MenuItem, MenuItemType } from '../../core';

export class LocationOverviewItems {

    menuItems: MenuItem[];

    constructor() {
        this.menuItems = [
            new MenuItem({ key: 'module.locations.submenu.myLocations' }, MenuItemType.trainer, 'locations', { icon: 'free_breakfast' }),
        ];
    }
}

export class NewLocationsMenuItems {
    
        menuItems: MenuItem[];
    
        constructor() {
            this.menuItems = [
                new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'locations', { icon: 'arrow_back' }),
                new MenuItem({ key: 'module.locations.submenu.new' }, MenuItemType.trainer, 'locations/new', { icon: 'create' }),
            ];
        }
    }

export class LocationsEditMenuItems {

    menuItems: MenuItem[];

    constructor(locationId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'locations', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.locations.submenu.preview' },  MenuItemType.trainer, 'locations/preview/' + locationId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.locations.submenu.edit' }, MenuItemType.trainer, 'locations/edit/' + locationId, { icon: 'edit' })
        ];
    }
}

export class LocationPreviewMenuItems {

    menuItems: MenuItem[];

    constructor(locationId: number) {
        this.menuItems = [
            new MenuItem({ key: 'menu.shared.back' }, MenuItemType.trainer, 'locations', { icon: 'arrow_back' }),
            new MenuItem({ key: 'module.locations.submenu.preview' }, MenuItemType.trainer, 'locations/preview/' + locationId, { icon: 'pageview' }),
            new MenuItem({ key: 'module.locations.submenu.edit' }, MenuItemType.trainer, 'locations/edit/' + locationId, { icon: 'edit' })
        ];
    }
}


