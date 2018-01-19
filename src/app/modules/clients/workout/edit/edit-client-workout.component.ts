import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ComponentDependencyService } from '../../../../core';
import { Workout } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
    selector: 'mod-edit-client-workout',
    templateUrl: 'edit-client-workout.component.html'
})
export class EditClientWorkoutComponent extends BaseClientModuleComponent implements OnInit {

    @Input() workoutId: number;

    @Output() loadWorkout = new EventEmitter<Workout>();

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public handleLoadWorkout(workout: Workout): void {
        this.loadWorkout.next(workout);
    }
}
