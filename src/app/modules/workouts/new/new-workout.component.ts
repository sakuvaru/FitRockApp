import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-new-workout',
    templateUrl: 'new-workout.component.html'
})
export class NewWorkoutComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initFom();
    }

    private initFom() {
        this.formConfig = this.dependencies.itemServices.workoutService.buildInsertForm({
            modifyDefaultDefinitionQuery: (query) => query.withData('IsTemplate', true)
        })
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
