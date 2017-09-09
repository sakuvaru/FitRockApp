// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Workout } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

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
            super.subscribeToObservable(this.getFormObservable(workoutId));
        }
    }

    handleClick(): void {
        throw Error('BOOM!');
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private getFormObservable(workoutId: number): Observable<any> {
        return this.dependencies.itemServices.workoutService.editForm(workoutId)
            .takeUntil(this.ngUnsubscribe)
            .map(form => {
                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
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