import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewFoodMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-food-page.component.html'
})
export class NewFoodPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.newFood' },
            menuItems: new NewFoodMenuItems().menuItems
        });
    }
}
