import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Workout } from '../../../models';
import { stringHelper } from 'lib/utilities';

@Component({
    selector: 'mod-edit-workout',
    templateUrl: 'edit-workout.component.html',
})
export class EditWorkoutComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Output() loadWorkout = new EventEmitter<Workout>();

    @Input() workoutId: number;

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnChanges(changes: SimpleChanges) {
        const workoutId = changes.workoutId.currentValue;
        if (workoutId) {
            this.initForm(workoutId);
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(workoutId: number): void {
        this.formConfig = this.dependencies.itemServices.workoutService.buildEditForm(workoutId)
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('workouts')]))
            .onEditFormLoaded(form => {
                this.loadWorkout.next(form.item);
            })
            .optionLabelResolver((field, label) => {
                if (field.key === 'WorkoutCategoryId') {
                    return super.translate(`module.workoutCategories.categories.${label}`);
                }
                if (field.key === 'Day') {
                    return super.translate('module.days.' + stringHelper.firstCharToLowerCase(label));
                }

                return Observable.of(label);
            })
            .build();
    }
}
