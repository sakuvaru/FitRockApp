import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { Workout } from '../../../../models';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditWorkoutMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'edit-client-workout.component.html'
})
export class EditClientWorkoutComponent extends ClientsBaseComponent implements OnInit {

    public workoutId: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }
    ngOnInit() {
        super.ngOnInit();

        this.initWorkoudId();
        super.subscribeToObservable(this.getMenuInitObservable());
        super.initClientSubscriptions();
    }

    private initWorkoudId(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.workoutId = +params['workoutId'];
            });
    }

    private getMenuInitObservable(): Observable<any> {
        return this.clientChange.map(client => {
            this.setConfig({
                menuItems: new ClientEditWorkoutMenuItems(client.id, this.workoutId).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                menuAvatarUrl: client.getAvatarOrGravatarUrl()
            });
        });
    }

    public handleLoadWorkout(workout: Workout): void {
        const translationData: any = {};
        translationData.workoutName = workout.workoutName;
        super.updateComponentTitle({ key: 'module.clients.workout.editWorkoutWithName', data: translationData });
    }
}
