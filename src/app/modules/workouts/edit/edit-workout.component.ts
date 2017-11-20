// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { Workout } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-workout.component.html'
})
export class EditWorkoutComponent extends BaseComponent implements OnInit {

    public workoutId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
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
