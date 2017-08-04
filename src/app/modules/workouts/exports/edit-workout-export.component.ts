// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Workout } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-workout-export.component.html',
    selector: 'edit-workout-export'
})
export class EditWorkoutExportComponent extends BaseComponent implements OnInit, OnChanges {

    @Output() loadWorkout = new EventEmitter();

    @Input() workoutId: number;

    private formConfig: FormConfig<Workout>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnChanges(changes: SimpleChanges) {
        var workoutId = changes.workoutId.currentValue;
        if (workoutId) {
            this.initForm(workoutId);
        }
    }

    handleClick(): void {
        throw Error('BOOM!');
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(workoutId: number): void {
        super.startLoader();

        this.dependencies.itemServices.workoutService.editForm(workoutId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([super.getTrainerUrl('workouts')]));
                var workout = form.getItem();

                // get form
                this.formConfig = form.build();

                // set loaded workout
                this.loadWorkout.next(workout);
            },
            error => super.handleError(error));
    }
}