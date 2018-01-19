import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
    selector: 'mod-new-client-workout',
    templateUrl: 'new-client-workout.component.html'
})
export class NewClientWorkoutComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.initForm();
        }
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.workoutService.buildInsertForm()
            .configField((field, item) => {
                if (field.key === 'ClientId') {
                    field.value = this.client.id;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + this.client.id + '/workout/' + response.item.id + '/workout-plan')]))
            .onInsertFormLoaded(form => {

            })
            .optionLabelResolver((field, label) => {
                if (field.key === 'WorkoutCategoryId') {
                    return super.translate(`module.workoutCategories.categories.${label}`);
                }

                return Observable.of(label);
            })
            .build();
    }
}
