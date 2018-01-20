import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewMealMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-meal-page.component.html'
})
export class NewMealPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.foods.submenu.newMeal' },
            menuItems: new NewMealMenuItems().menuItems
        });
    }
}
