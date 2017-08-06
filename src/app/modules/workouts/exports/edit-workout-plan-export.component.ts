// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { Workout, WorkoutExercise, Exercise } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Rx';
import { CacheKeyType } from '../../../../lib/repository';
import { StringHelper } from '../../../../lib/utilities';
import { SelectWorkoutExerciseDialogComponent } from '../dialogs/select-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from '../dialogs/edit-workout-exercise-dialog.component';
import { AddWorkoutExerciseDialogComponent } from '../dialogs/add-workout-exercise-dialog.component';
import { AddCustomExerciseDialogComponent } from '../dialogs/add-custom-exercise-dialog.component';
import * as _ from 'underscore';

@Component({
  templateUrl: 'edit-workout-plan-export.component.html',
  selector: 'edit-workout-plan-export'
})
export class EditWorkoutPlanExportComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {

  @Output() loadWorkout = new EventEmitter();

  @Input() workoutId: number;

  private workout: Workout;
  private sortedWorkoutExercises: WorkoutExercise[];

  /**
  * Drop subscription for dragula - Unsubscribe on OnDestroy + destroy dragula itself!
  */
  private dropSubscription: Subscription;

  private dragulaBag: string = 'dragula-bag';

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.startLoader();

    // set handle for dragula
    this.dragulaService.setOptions(this.dragulaBag, {
      moves: function (el: any, container: any, handle: any): any {
        return StringHelper.contains(handle.className, 'dragula-move-handle');
      }
    });

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

    // unsubscribe from dragula drop events
    this.dropSubscription.unsubscribe();
    this.dragulaService.destroy(this.dragulaBag);
  }

  ngOnChanges(changes: SimpleChanges) {
    var workoutId = changes.workoutId.currentValue;
    if (workoutId) {
      this.initWorkout(workoutId)
    }
  }

  private initWorkout(workoutId: number): void {
    this.dependencies.itemServices.workoutService.item()
      .byId(workoutId)
      .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
      .get()
      .subscribe(response => {
        this.loadWorkout.next(response.item);

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
        super.handleError(error);
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

        // recalculate local order
        this.recalculateOrder();
      }
      else {
        // update exercice with updated data
        var workoutExerciseToUpdate: WorkoutExercise[] = this.sortedWorkoutExercises.filter(m => m.id === workoutExercise.id);

        if (!workoutExerciseToUpdate) {
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

  private recalculateOrder(): void {
    if (this.sortedWorkoutExercises) {
      var order = 0;
      this.sortedWorkoutExercises.forEach(workoutExercise => {
        workoutExercise.order = order;
        order++;
      })
    }
  }
}