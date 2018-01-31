import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { Workout } from 'app/models';
import { ClientEditWorkoutMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'edit-client-workout-page.component.html'
})
export class EditClientWorkoutPageComponent extends BaseClientsPageComponent implements OnInit {

    public workoutId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit() {
        super.ngOnInit();
        this.init();
    }

    private init(): void {

        super.subscribeToObservable(
            this.clientChange.switchMap(client =>
                this.activatedRoute.params.map(params => {
                    this.workoutId = +params['workoutId'];
                })));
    }

    onLoadWorkout(workout: Workout): void {
        const translationData: any = {};
        translationData.workoutName = workout.workoutName;

        this.setConfig({
            componentTitle: { key: 'module.clients.workout.editWorkoutWithName', data: translationData },
            menuItems: new ClientEditWorkoutMenuItems(this.client.id, workout.id).menuItems,
            menuTitle: {
                key: 'module.clients.viewClientSubtitle',
                data: { 'fullName': this.client.getFullName() }
            },
            menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
        });
    }
}
