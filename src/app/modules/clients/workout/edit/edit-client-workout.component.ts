// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';
import { Observable } from 'rxjs/Rx';

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

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
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
