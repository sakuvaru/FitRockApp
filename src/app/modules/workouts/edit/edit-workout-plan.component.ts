// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Workout, WorkoutExercise, Exercise } from '../../../models';
import { DragulaService, dragula } from 'ng2-dragula';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { SelectWorkoutExerciseDialogComponent } from '../dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from '../dialogs/edit-workout-exercise-dialog.component';
import { AddWorkoutExerciseDialogComponent } from '../dialogs/add-workout-exercise-dialog.component';
import * as _ from 'underscore';

@Component({
  templateUrl: 'edit-workout-plan.component.html'
})
export class EditWorkoutPlanComponent extends BaseComponent implements OnInit {

  private workout: Workout;

  private sortedWorkoutExercises: WorkoutExercise[];

  private dropSubscription: Subscription;

  /**
  *access the form with 'id' of the exercise
  * e.g. exerciseForms['9']
  **/
  private exerciseForms = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
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
        this.stopGlobalLoader();
        this.showSavedSnackbar();
      });
  }

  ngOnDestroy() {
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

  private openWorkoutExerciseDialog(workoutExercise: WorkoutExercise): void {
    var dialog = this.dependencies.tdServices.dialogService.open(EditWorkoutExerciseDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: workoutExercise
    });

    dialog.afterClosed().subscribe(m => {
      // update || remove workout exercise from local variables
      if (dialog.componentInstance.workoutExerciseWasDeleted) {
        /*
        // set order of all items with higher order to be -1
        var subtract = false;
       _.forEach(this.sortedWorkoutExercises, (sortedWorkoutExercise) => {
         // workout exercises are already sorted by dragula & their index represents their order (the 'order' property does not!)
         if (sortedWorkoutExercise.id === workoutExercise.id){
           subtract = true;
         }
         if (subtract){
           sortedWorkoutExercise.order--;
         }
       });
       */

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

  private onDrop(orderedWorkoutExercises: WorkoutExercise[]) {

  }

  private openSelecExerciseDialog(): void {
    var dialog = this.dependencies.tdServices.dialogService.open(SelectWorkoutExerciseDialogComponent, {
      width: AppConfig.DefaultDialogWidth,
      data: this.workout.id
    });

    dialog.afterClosed().subscribe(m => {
      // open new add workout dialog 
      this.openAddWorkoutDialog(dialog.componentInstance.selectedExercise);
    })
  }

  private openAddWorkoutDialog(exercise: Exercise): void {
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
      this.dependencies.itemServices.workoutExerciseService.item().byId(dialog.componentInstance.newWorkoutExercise.id)
        .includeMultiple(['Exercise', 'Exercise.ExerciseCategory'])
        .get()
        .subscribe(response => {
          this.sortedWorkoutExercises.push(response.item);
        })
    })
  }
}