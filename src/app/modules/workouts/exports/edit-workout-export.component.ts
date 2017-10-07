// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

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

    setup(): ComponentSetup | null {
        return {
            initialized: false
        }
      }

    ngOnChanges(changes: SimpleChanges) {
        var workoutId = changes.workoutId.currentValue;
        if (workoutId) {
            this.initForm(workoutId);
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    private initForm(workoutId: number): void {
        this.formConfig = this.dependencies.itemServices.workoutService.editForm(workoutId)
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('workouts')]))
            .onFormLoaded(form => this.loadWorkout.next(form.item))
            .build();
    }
}