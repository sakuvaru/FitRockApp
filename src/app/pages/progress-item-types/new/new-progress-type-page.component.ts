import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewProgressItemTypeMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-progress-type-page.component.html'
})
export class NewProgressTypePageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.setConfig({
            componentTitle: { key: 'module.progressItemTypes.submenu.new' },
            menuItems: new NewProgressItemTypeMenuItems().menuItems,
            menuTitle: { key: 'module.progressItemTypes.submenu.overview' }
        });
    }
}
