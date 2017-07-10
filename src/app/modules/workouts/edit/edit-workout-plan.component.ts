// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { Workout, WorkoutExercise, Exercise } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Rx';
import { SelectWorkoutExerciseDialogComponent } from '../dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from '../dialogs/edit-workout-exercise-dialog.component';
import { AddWorkoutExerciseDialogComponent } from '../dialogs/add-workout-exercise-dialog.component';
import { AddCustomExerciseDialogComponent } from '../dialogs/add-custom-exercise-dialog.component';
import * as _ from 'underscore';

@Component({
  templateUrl: 'edit-workout-plan.component.html'
})
export class EditWorkoutPlanComponent extends BaseComponent implements OnInit, OnDestroy {

  private workout: Workout;
  private sortedWorkoutExercises: WorkoutExercise[];
  private dropSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.startLoader();

    // init workout
    this.initWorkout();

    // subscribe to drop events
    this.dropSubscription = this.dragulaService.drop
      .do(() => this.startGlobalLoader())
      .debounceTime(500)
      .switchMap(() => {
        return this.dependencies.itemServices.workoutExerciseService.updateItemsOrder(this.sortedWorkoutExercises, this.workout.id).set();
      })
      .subscribe(() => {
        super.stopGlobalLoader();
        super.showSavedSnackbar();
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    // unsubscribe to drop events
    this.dropSubscription.unsubscribe();
  }

  private initWorkout(): void {
    this.activatedRoute.params
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .subscribe(response => {

        this.setConfig({
          menuItems: new WorkoutMenuItems(response.item.id).menuItems,
          menuTitle: {
            key: response.item.workoutName
          },
          componentTitle: {
            'key': 'module.workouts.editPlan'
          }
        });

        this.assignWorkout(response.item);
        this.stopLoader();
      });
  }

  private assignWorkout(workout: Workout): void {
    // assign workout after all forms are ready and loaded + after ordering execises
    workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);
    this.sortedWorkoutExercises = workout.workoutExercises = workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);
    this.workout = workout;
  }

  private deleteWorkoutExercise(workoutExercise: WorkoutExercise): void {
    this.startGlobalLoader();
    this.dependencies.itemServices.workoutExerciseService.delete(workoutExercise.id)
      .set()
      .do(() => this.startGlobalLoader())
      .subscribe(response => {
        // remove workout exercise from local variable
        this.sortedWorkoutExercises = _.reject(this.sortedWorkoutExercises, function (item) { return item.id === response.deletedItemId; });

        this.showSavedSnackbar();

        this.stopGlobalLoader();
      },
      (error) => {
        this.stopGlobalLoader();
      });
  }

  private openWorkoutExerciseDialog(workoutExercise: WorkoutExercise): void {
    var dialog = this.dependencies.tdServices.dialogService.open(EditWorkoutExerciseDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: workoutExercise
    });

    dialog.afterClosed().subscribe(m => {
      // update || remove workout exercise from local variable
      if (dialog.componentInstance.workoutExerciseWasDeleted) {
        // remove exercise
        this.sortedWorkoutExercises = _.reject(this.sortedWorkoutExercises, function (item) { return item.id === dialog.componentInstance.idOfDeletedWorkoutExercise; });
      }
      else {
        // update exercice with updated data
        var workoutExerciseToUpdate = this.sortedWorkoutExercises.filter(m => m.id === workoutExercise.id);

        if (!workoutExerciseToUpdate && workoutExerciseToUpdate.length === 1) {
          throw Error(`Cannot update workout with new values from saved form`);
        }

        // update data
        workoutExerciseToUpdate[0].reps = dialog.componentInstance.workoutExercise.reps;
        workoutExerciseToUpdate[0].sets = dialog.componentInstance.workoutExercise.sets;
      }
    })
  }

  private openSelecExerciseDialog(): void {
    var data: any = {};
    data.workoutId = this.workout.id;

    var dialog = this.dependencies.tdServices.dialogService.open(SelectWorkoutExerciseDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: data
    });

    dialog.afterClosed().subscribe(m => {
      // open new add workout dialog if some exercise was selected
      if (dialog.componentInstance.selectedExercise) {
        this.openAddWorkoutExerciseDialog(dialog.componentInstance.selectedExercise);
      }
      // or open new custom exercise dialog
      else if (dialog.componentInstance.openAddCustomExerciseDialog) {
        this.openAddCustomExerciseDialog();
      }
    })
  }

  private openAddCustomExerciseDialog(): void {
    var dialog = this.dependencies.tdServices.dialogService.open(AddCustomExerciseDialogComponent, {
      width: AppConfig.DefaultDialogWidth
    });

    dialog.afterClosed().subscribe(m => {
      // open add workout exercise dialog if new custom exercise was created 
      if (dialog.componentInstance.newExercise) {
        this.openAddWorkoutExerciseDialog(dialog.componentInstance.newExercise);
      }
    })
  }

  private openAddWorkoutExerciseDialog(exercise: Exercise): void {
    var data: any = {};
    data.workoutId = this.workout.id;
    data.exercise = exercise;

    var dialog = this.dependencies.tdServices.dialogService.open(AddWorkoutExerciseDialogComponent, {
      data: data,
      width: AppConfig.DefaultDialogWidth
    });

    dialog.afterClosed().subscribe(m => {
      // add newly added workout exercise to list of current exercises
      // but first load whole object with category
      if (dialog.componentInstance.newWorkoutExercise) {
        this.dependencies.itemServices.workoutExerciseService.item().byId(dialog.componentInstance.newWorkoutExercise.id)
          .includeMultiple(['Exercise', 'Exercise.ExerciseCategory'])
          .get()
          .subscribe(response => {
            this.sortedWorkoutExercises.push(response.item);
          })
      }
    })
  }
}