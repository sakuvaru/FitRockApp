// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { User, Workout, WorkoutExercise } from '../../../../models';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/switchMap';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';
import { stringHelper } from '../../../../../lib/utilities';

@Component({
    templateUrl: 'client-workout.component.html'
})
export class ClientWorkoutComponent extends ClientsBaseComponent implements OnInit, OnDestroy {

    private workoutExists: boolean = true;
    private workoutTemplates: Workout[];
    private existingWorkouts: Workout[];

    /**
     * Name of the dragula bag - used in template & config
     */
    private readonly dragulaBag: string = 'dragula-bag';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    private readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    /**
     * Indicates which workout is expanded
     */
    private expandedWorkoutId: number | null = null;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute,
        private dragulaService: DragulaService
    ) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initDragula();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    private initDragula(): void {
        // set handle for dragula
        var that = this;
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return stringHelper.contains(el.className, that.dragulaMoveHandle);
            }
        });

        // subscribe to drop events
        this.dropSubscription = this.dragulaService.drop
            .do(() => super.startGlobalLoader())
            .debounceTime(500)
            .takeUntil(this.ngUnsubscribe)
            .switchMap(() => {
                return this.dependencies.itemServices.workoutService.updateItemsOrder(this.existingWorkouts, this.clientId).set();
            })
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];

        var obsClientMenu = this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.workout'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });

        var obsExistingExercises = this.existingWorkoutsObservable();

        var varWorkoutTemplates = this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.workoutService.items()
                .byCurrentUser()
                .whereEmpty('ClientId')
                .orderByAsc("WorkoutName")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.workoutTemplates = response.items;
                }
            });

        observables.push(obsClientMenu);
        observables.push(obsExistingExercises);
        observables.push(varWorkoutTemplates);

        return observables;
    }

    private existingWorkoutsObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.workoutService.items()
                .byCurrentUser()
                .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
                .whereEquals('ClientId', clientId)
                .orderByAsc("Order")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingWorkouts = response.items;
                }
            });
    }

    private reloadExistingWorkoutsObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
            .whereEquals('ClientId', clientId)
            .orderByAsc("Order")
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingWorkouts = response.items;
                }
            });
    }

    private newWorkoutFromTemplate(data: any): void {
        var selected = data.selected;

        if (!selected) {
            super.translate('module.clients.workout.workoutNotSelected').subscribe(text => {
                super.showErrorDialog(text)
            });
        }

        var selectedWorkout = selected.value as Workout;

        // copy data from selected workout to a new workout with assigned client
        super.subscribeToObservable(this.dependencies.itemServices.workoutService.copyFromWorkout(selectedWorkout.id, this.clientId)
            .set()
            .flatMap(response => this.reloadExistingWorkoutsObservable(this.clientId))
        );

    }

    private deleteWorkout(workout: Workout): void {
        super.subscribeToObservable(this.dependencies.itemServices.workoutService.delete(workout.id)
            .set()
            .map(response => {
                // remove workout  from local variable
                this.existingWorkouts = _.reject(this.existingWorkouts, function (item) { return item.id === response.deletedItemId; });
                this.showDeletedSnackbar();
            }));
    }

    private goToEditWorkout(workout: Workout): void {
        super.navigate([this.getTrainerUrl('clients/edit/' + this.clientId + '/workout/' + workout.id + '/workout-plan')]);
    }

    private expandWorkout(workout: Workout): void {
        if (this.expandedWorkoutId === workout.id) {
            this.expandedWorkoutId = null;
        }
        else {
            this.expandedWorkoutId = workout.id;
        }
    }
}

