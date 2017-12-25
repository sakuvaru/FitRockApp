import 'rxjs/add/operator/switchMap';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Workout } from '../../../models';

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

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: true
        });
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
            .build();
    }
}
