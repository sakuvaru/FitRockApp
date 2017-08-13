// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-client-workout.component.html'
})
export class EditClientWorkoutComponent extends ClientsBaseComponent implements OnInit {

    private workoutId: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initWorkoudId();
        super.initClientSubscriptions();
    }

    private initWorkoudId(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.workoutId = +params['workoutId'];
            });
    }

    private handleLoadWorkout(workout: Workout): void {
        this.setConfig({
            menuItems: new ClientEditWorkoutMenuItems(this.clientId, this.workoutId).menuItems,
            menuTitle: {
                key: 'module.clients.workout.editWorkout'
            },
            componentTitle: {
                key: workout.workoutName
            }
        });
    }
}