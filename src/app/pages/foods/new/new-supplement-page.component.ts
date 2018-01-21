import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewSupplementMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-supplement-page.component.html'
})
export class NewSupplementPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.newSupplement' },
            menuItems: new NewSupplementMenuItems().menuItems
        });
    }
}
