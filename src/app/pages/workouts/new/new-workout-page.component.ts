import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewWorkoutMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-workout-page.component.html'
})
export class NewWorkoutPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.workouts.submenu.new' },
            menuItems: new NewWorkoutMenuItems().menuItems
        });
    }
}
