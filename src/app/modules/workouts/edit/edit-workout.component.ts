import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Workout } from '../../../models';
import { WorkoutMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-workout.component.html'
})
export class EditWorkoutComponent extends BasePageComponent implements OnInit {

    public workoutId: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
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

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.workoutId = +params['id'];
            });
    }

    public handleLoadWorkout(workout: Workout): void {
        this.setConfig({
            menuItems: new WorkoutMenuItems(workout.id).menuItems,
            menuTitle: {
                key: workout.workoutName
            },
            componentTitle: {
                'key': 'module.workouts.editWorkout'
            }
        });
    }
}
