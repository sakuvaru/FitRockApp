import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { NewWorkoutMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-workout.component.html'
})
export class NewWorkoutComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.workouts.submenu.new' },
            menuItems: new NewWorkoutMenuItems().menuItems
        });

        this.initFom();
    }

    private initFom() {
        this.formConfig = this.dependencies.itemServices.workoutService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('workouts/edit-plan'), response.item.id]))
            .optionLabelResolver((field, label) => {
                if (field.key === 'WorkoutCategoryId') {
                    return super.translate(`module.workoutCategories.categories.${label}`);
                }

                return Observable.of(label);
            })
            .build();
    }
}
