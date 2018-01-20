import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewLocationsMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-location-page.component.html'
})
export class NewLocationPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            menuTitle: { key: 'module.locations.submenu.overview' },
            componentTitle: { key: 'module.locations.submenu.new' },
            menuItems: new NewLocationsMenuItems().menuItems
        });
    }
}
