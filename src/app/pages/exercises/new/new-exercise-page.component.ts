import { Component, OnInit } from '@angular/core';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewExerciseMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-exercise-page.component.html'
})
export class NewExercisePageComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.exercises.new' },
            menuItems: new NewExerciseMenuItems().menuItems
        });
    }
}
