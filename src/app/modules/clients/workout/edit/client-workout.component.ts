// common
import 'rxjs/add/operator/switchMap';

import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Observable, Subscription } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService } from '../../../../core';
import { Workout, WorkoutExercise, Day } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';
import { WorkoutListDialogComponent } from '../dialogs/workout-list-dialog.component';

@Component({
    selector: 'mod-client-workout',
    templateUrl: 'client-workout.component.html'
})
export class ClientWorkoutComponent extends BaseClientModuleComponent implements OnInit, OnDestroy, OnChanges {

    public workoutTemplates: Workout[] = [];

    /**
     * Name of the dragula bag - used in the template & config
     */
    public readonly dragulaBag: string = 'dragula-bag';
    public readonly dragulaBagParent: string = 'dragula-bag-parent';

    /**
     * Class of the handle used to drag & drop dragula items
     */
    public readonly dragulaMoveHandle: string = 'dragula-move-handle';

    /**
     * Drop subscription for dragula - Unsubscribe on destroy!
     */
    private dropSubscription: Subscription;

    public days: DayWithWorkouts[] = [];

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
        this.makeSureDragulaIsUnsubscribed();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.makeSureDragulaIsUnsubscribed();
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
                // reload workouts
                return this.existingWorkoutsObservable();
            })
            .map(response => {
                super.showSavedSnackbar();
            }));
    }

    deleteWorkout(workout: Workout): void {
        super.subscribeToObservable(this.dependencies.itemServices.workoutService.delete(workout.id)
            .set()
            .map(response => {
                // remove workout  from local letiable
                this.days.map(day => day.workouts = _.reject(day.workouts, function (item) { return item.id === response.deletedItemId; }));
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

    private makeSureDragulaIsUnsubscribed(): void {
        // unsubscribe from dragula drop events
        if (this.dropSubscription) {
            this.dropSubscription.unsubscribe();
        }

        if (this.dragulaService.find(this.dragulaBag)) {
            this.dragulaService.destroy(this.dragulaBag);
        }
        if (this.dragulaService.find(this.dragulaBagParent)) {
            this.dragulaService.destroy(this.dragulaBagParent);
        }
    }

    private init(): void {
        const observables: Observable<void>[] = [];
        observables.push(this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .whereNull('ClientId')
            .orderByAsc('WorkoutName')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    this.workoutTemplates = response.items;
                }
            }));


        // days need to loaded before workouts can be initialized
        observables.push(this.getInitDaysObservable().flatMap(() => this.existingWorkoutsObservable()));

        super.subscribeToObservables(observables);

        this.initDragula();
    }

    private initDragula(): void {
        // set handle for dragula
        const that = this;
        this.dragulaService.setOptions(this.dragulaBag, {
            moves: function (el: any, container: any, handle: any): any {
                return stringHelper.contains(handle.className, that.dragulaMoveHandle);
            }
        });

        this.dragulaService.setOptions(this.dragulaBagParent, {
            moves: function (el: any, container: any, handle: any): any {
                // we don't want parent to move 
                return false;
            }
        });

        // subscribe to drop events
        this.dropSubscription = this.dragulaService.drop
            .do(() => super.startGlobalLoader())
            .debounceTime(500)
            .flatMap(value => {
                const updateOrderObservable = this.dependencies.itemServices.workoutService.updateItemsOrder(this.getOrderedWorkoutsFromDays(), this.client.id).set();
                const updateWorkoutObservable = this.getUpdateWorkoutDayObservable();

                return updateOrderObservable.zip(updateWorkoutObservable);
            })

            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                super.stopGlobalLoader();
                super.showSavedSnackbar();
            });
    }

    private getOrderedWorkoutsFromDays(): Workout[] {
        const orderedWorkouts: Workout[] = [];
        this.days.map(day => day.workouts.map(s => orderedWorkouts.push(s)));

        return orderedWorkouts;
    }

    private getUpdateWorkoutDayObservable(): Observable<void> {
        // go through all days and find diet which were updated
        let saveObservable = Observable.of(undefined);
        this.days.map(day => day.workouts.map(workout => {
            if (workout.day !== day.day.day) {
                // Day was change, update local variables 
                workout.day = day.day.day;
                workout.dayString = day.day.dayString;

                saveObservable = this.dependencies.itemServices.workoutService.edit(workout).set().map(response => undefined);
            }
        }));

        return saveObservable;
    }

    private existingWorkoutsObservable(): Observable<void> {
        return this.dependencies.itemServices.workoutService.items()
            .byCurrentUser()
            .includeMultiple(['WorkoutExercises', 'WorkoutExercises.Exercise'])
            .whereEquals('ClientId', this.client.id)
            .orderByAsc('Order')
            .get()
            .map(response => {
                if (!response.isEmpty()) {
                    // assign workouts to days
                    this.assignWorkoutToDays(response.items);
                }
            });
    }

    private reloadExistingWorkoutsObservable(clientId: number): Observable<void> {
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

    private assignWorkoutToDays(workouts: Workout[]): void {
        if (!workouts || workouts.length === 0) {
            return;
        }

        // first make sure that days contain no diets
        this.days.map(day => {
            day.workouts = [];
        });

        const unassignedDayValue = 0;
        const unassignedDay = this.days.find(m => m.day.day === unassignedDayValue);

        if (!unassignedDay) {
            throw Error(`Could not find unassigned day with value '${unassignedDayValue}'`);
        }

        workouts.forEach(workout => {
            const day = this.days.find(m => m.day.day === workout.day);

            if (!day) {
                // unassigned diet
                unassignedDay.workouts.push(workout);
            } else {
                day.workouts.push(workout);
            }
        });

        // order workouts based on their order
        this.days.map(day => {
            day.workouts = _.sortBy(day.workouts, m => m.order);
        });
    }

    private getInitDaysObservable(): Observable<void> {
        return this.dependencies.coreServices.serverService.getDays()
            .map(days => {
                this.days = days.map(day => new DayWithWorkouts(day, []));
            });
    }
}

class DayWithWorkouts {
    constructor(
        public day: Day,
        public workouts: Workout[] = []
    ) { }
}
