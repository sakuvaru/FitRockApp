// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { User, Workout, WorkoutExercise } from '../../../../models';
import { DragulaService } from 'ng2-dragula';
import 'rxjs/add/operator/switchMap';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';
import { StringHelper } from '../../../../../lib/utilities';
import { DataSource } from '@angular/cdk';

@Component({
    templateUrl: 'client-workout.component.html'
})
export class ClientWorkoutComponent extends BaseComponent implements OnInit, OnDestroy {

    private clientId: number;
    private workoutExists: boolean = true;
    private workoutTemplates: Workout[] = [];
    private existingWorkouts: Workout[];
    private observables: Observable<any>[] = [];
    private observablesCompleted: number = 0;

    private readonly dragulaBag: string = 'dragula-bag';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dragulaService: DragulaService,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.startLoader();

        // set handle for dragula
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return StringHelper.contains(handle.className, 'dragula-move-handle');
            }
        });


        // subscribe to drop events
        this.dropSubscription = this.dragulaService.drop
            .debounceTime(500)
            .takeUntil(this.ngUnsubscribe)
            .switchMap(() => {
                return this.dependencies.itemServices.workoutService.updateItemsOrder(this.existingWorkouts, this.clientId).set();
            })
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });

        var joinedObservable = this.getJoinedObservable();

        joinedObservable
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            () => {
                this.observablesCompleted++;
                if (this.observablesCompleted === this.observables.length) {
                    super.stopLoader();
                    this.observablesCompleted = 0;
                }
            }
            ,
            error => super.handleError(error));

    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    private getJoinedObservable(): Observable<any> {
        var obsClientId = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map(params => this.clientId = +params['id']);

        var obsClient = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.userService.editForm(+params['id']))
            .map(form => {
                var client = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.workout'
                    }
                });
            });

        var obsExistingExercises = this.existingWorkoutsObservable();

        var varWorkoutTemplates = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.workoutService.items()
                .byCurrentUser()
                .whereNullOrEmpty('ClientId')
                .orderByAsc("WorkoutName")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.workoutTemplates = response.items;
                }
            });

        this.observables.push(obsClientId);
        this.observables.push(obsClient);
        this.observables.push(obsExistingExercises);
        this.observables.push(varWorkoutTemplates);

        return this.dependencies.coreServices.repositoryClient.mergeObservables(this.observables);
    }

    private existingWorkoutsObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.workoutService.items()
                .byCurrentUser()
                .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
                .whereEquals('ClientId', +params['id'])
                .orderByAsc("Order")
                .get())
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingWorkouts = response.items;
                }
            });
    }

    private newWorkoutFromTemplate(data: any): void {
        var selected = data.selected;

        if (!selected) {
            super.translate('module.clients.workoutNotSelected').subscribe(text => {
                super.showErrorDialog(text)
            });
        }

        var selectedWorkout = selected.value as Workout;

        super.startLoader();

        // copy data from selected workout to a new workout with assigned client
        this.dependencies.itemServices.workoutService.copyFromWorkout(selectedWorkout.id, this.clientId)
            .set()
            .subscribe(response => {
                var obsExistingExercises = this.existingWorkoutsObservable();
                obsExistingExercises.subscribe((response) => {
                    super.stopLoader();
                },
                    error => super.handleError(error)
                )
            },
            error => super.handleError(error)
            );
    }

    private deleteWorkout(workout: Workout): void {
        this.startGlobalLoader();
        this.dependencies.itemServices.workoutService.delete(workout.id)
            .set()
            .do(() => this.startGlobalLoader())
            .subscribe(response => {
                // remove workout  from local variable
                this.existingWorkouts = _.reject(this.existingWorkouts, function (item) { return item.id === response.deletedItemId; });

                this.showSavedSnackbar();
                this.stopGlobalLoader();
            },
            (error) => {
                super.handleError(error);
                this.stopGlobalLoader();
            });
    }
}

