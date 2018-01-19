// common
import 'rxjs/add/operator/switchMap';

import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService } from '../../../../core';
import { Workout, WorkoutExercise } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';
import { WorkoutListDialogComponent } from '../dialogs/workout-list-dialog.component';

@Component({
    selector: 'mod-client-workout',
    templateUrl: 'client-workout.component.html'
})
export class ClientWorkoutComponent extends BaseClientModuleComponent implements OnInit, OnDestroy, OnChanges {

    public workoutExists: boolean = true;
    public workoutTemplates: Workout[];
    public existingWorkouts: Workout[];

    /**
     * Name of the dragula bag - used in template & config
     */
    public readonly dragulaBag: string = 'dragula-bag';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    public readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    /**
     * Indicates which workout is expanded
     */
    public expandedWorkoutId: number | null = null;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        private dragulaService: DragulaService
    ) {
        super(componentDependencyService);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.init();
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();

        // unsubscribe from dragula drop events
        this.dropSubscription.unsubscribe();
        this.dragulaService.destroy(this.dragulaBag);
    }

    newWorkoutFromTemplate(data: any): void {
        const selected = data.selected;

        if (!selected) {
            super.translate('module.clients.workout.workoutNotSelected').subscribe(text => {
                super.showErrorDialog(text);
            });
        }

        const selectedWorkout = selected.value as Workout;

        // copy data from selected workout to a new workout with assigned client
        super.subscribeToObservable(this.dependencies.itemServices.workoutService.copyFromWorkout(selectedWorkout.id, this.client.id)
            .set()
            .flatMap(response => {
                super.showSavedSnackbar();
                return this.reloadExistingWorkoutsObservable(this.client.id);
            })
        );

    }

    deleteWorkout(workout: Workout): void {
        super.subscribeToObservable(this.dependencies.itemServices.workoutService.delete(workout.id)
            .set()
            .map(response => {
                // remove workout  from local letiable
                this.existingWorkouts = _.reject(this.existingWorkouts, function (item) { return item.id === response.deletedItemId; });
                this.showDeletedSnackbar();
            }));
    }

    goToEditWorkout(workout: Workout): void {
        super.navigate([this.getTrainerUrl('clients/edit/' + this.client.id + '/workout/' + workout.id + '/workout-plan')]);
    }

    openWorkoutListDialog(workoutExercises: WorkoutExercise[]): void {
        const data: any = {};
        data.workoutExercises = workoutExercises;

        const dialog = this.dependencies.tdServices.dialogService.open(WorkoutListDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: data
        });
    }

    private initDragula(): void {
        // set handle for dragula
        const that = this;
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
                return this.dependencies.itemServices.workoutService.updateItemsOrder(this.existingWorkouts, this.client.id).set();
            })
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });
    }

    private init(): void {
        const observables: Observable<any>[] = [];

        observables.push(this.existingWorkoutsObservable());
        observables.push(this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .whereEmpty('ClientId')
            .orderByAsc('WorkoutName')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.workoutTemplates = response.items;
                }
            }));

        super.subscribeToObservables(observables);

        this.initDragula();
    }

    private existingWorkoutsObservable(): Observable<any> {
        return this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
            .whereEquals('ClientId', this.client.id)
            .orderByAsc('Order')
            .get()

            .map(response => {
                if (!response.isEmpty()) {
                    this.existingWorkouts = response.items;

                    // order workout exercises
                    this.existingWorkouts.forEach(workout => {
                        workout.workoutExercises = _.sortBy(workout.workoutExercises, m => m.order);
                    });
                }
            });
    }

    private reloadExistingWorkoutsObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
            .whereEquals('ClientId', clientId)
            .orderByAsc('Order')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.existingWorkouts = response.items;
                }
            });
    }
}

