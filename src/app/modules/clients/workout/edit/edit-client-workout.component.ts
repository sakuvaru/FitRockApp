// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-client-workout.component.html'
})
export class EditClientWorkoutComponent extends BaseComponent implements OnInit {

    private clientId: number;
    private workoutId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.workoutId = +params['workoutId'];
                this.clientId = +params['id'];
            });
    }

    private handleLoadWorkout(workout: Workout): void {
        this.setConfig({
            menuItems: new ClientEditWorkoutMenuItems(this.clientId, this.workoutId).menuItems,
            menuTitle: {
                key: 'module.clients.editWorkout'
            },
            componentTitle: {
                key: workout.workoutName
            }
        });
    }
}