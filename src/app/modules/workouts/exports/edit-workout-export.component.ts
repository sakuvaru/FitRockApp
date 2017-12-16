// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { Workout } from '../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-workout-export.component.html',
    selector: 'edit-workout-export'
})
export class EditWorkoutExportComponent extends BaseComponent implements OnInit, OnChanges {

    @Output() loadWorkout = new EventEmitter<Workout>();

    @Input() workoutId: number;

    public formConfig: DataFormConfig;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return null;
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
        this.formConfig = this.dependencies.itemServices.workoutService.buildEditForm(workoutId, (error) => super.handleAppError(error))
            .onAfterDelete(() => super.navigate([super.getTrainerUrl('workouts')]))
            .onEditFormLoaded(form => {
                this.loadWorkout.next(form.item);
            })
            .build();
    }
}
