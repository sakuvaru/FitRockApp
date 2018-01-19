import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../lib/utilities';
import { AppConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Exercise, Workout, WorkoutExercise } from '../../../models';
import { AddCustomExerciseDialogComponent } from '../dialogs/add-custom-exercise-dialog.component';
import { AddWorkoutExerciseDialogComponent } from '../dialogs/add-workout-exercise-dialog.component';
import { EditWorkoutExerciseDialogComponent } from '../dialogs/edit-workout-exercise-dialog.component';
import { SelectWorkoutExerciseDialogComponent } from '../dialogs/select-workout-exercise-dialog.component';

@Component({
  templateUrl: 'edit-workout-plan-export.component.html',
  selector: 'edit-workout-plan-export'
})
export class EditWorkoutPlanExportComponent extends BasePageComponent implements OnDestroy, OnChanges {

  @Output() loadWorkout = new EventEmitter();

  @Input() workoutId: number;

  public workout: Workout;
  public sortedWorkoutExercises: WorkoutExercise[];

  public readonly dragulaBag: string = 'dragula-bag';
  public readonly dragulaHandle: string = 'dragula-move-handle';

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);

    // set handle for dragula
    const that = this;
    this.dragulaService.setOptions(this.dragulaBag, {
      moves: function (el: any, container: any, handle: any): any {
        return stringHelper.contains(el.className, that.dragulaHandle);
      }
    });

    super.subscribeToObservable(this.getInitObservable());
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    // unsubscribe from dragula drop events
    this.dragulaService.destroy(this.dragulaBag);
  }

  ngOnChanges(changes: SimpleChanges) {
    const workoutId = changes.workoutId.currentValue;
    if (workoutId) {
      super.subscribeToObservable(this.getWorkoutObservable(workoutId));
    }
  }

  openWorkoutExerciseDialog(workoutExercise: WorkoutExercise): void {
    const dialog = this.dependencies.tdServices.dialogService.open(EditWorkoutExerciseDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: workoutExercise
    });

    dialog.afterClosed().subscribe(m => {
      // update || remove workout exercise from local letiable
      if (dialog.componentInstance.workoutExerciseWasDeleted) {
        // remove exercise
        this.sortedWorkoutExercises = _.reject(this.sortedWorkoutExercises, function (item) { return item.id === dialog.componentInstance.idOfDeletedWorkoutExercise; });

        // recalculate local order
        this.recalculateOrder();
      } else {
        // update exercice with updated data
        const workoutExerciseToUpdate: WorkoutExercise[] = this.sortedWorkoutExercises.filter(s => s.id === workoutExercise.id);

        if (!workoutExerciseToUpdate) {
          throw Error(`Cannot update workout with new values from saved form`);
        }

        // update data
        workoutExerciseToUpdate[0].reps = dialog.componentInstance.workoutExercise.reps;
        workoutExerciseToUpdate[0].sets = dialog.componentInstance.workoutExercise.sets;
      }
    });
  }

  openSelecExerciseDialog(): void {
    const data: any = {};
    data.workoutId = this.workout.id;

    const dialog = this.dependencies.tdServices.dialogService.open(SelectWorkoutExerciseDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass,
      data: data
    });

    dialog.afterClosed().subscribe(m => {
      // open new add workout dialog if some exercise was selected
      if (dialog.componentInstance.selectedExercise) {
        this.openAddWorkoutExerciseDialog(dialog.componentInstance.selectedExercise);
      } else if (dialog.componentInstance.openAddCustomExerciseDialog) {
        // or open new custom exercise dialog
        this.openAddCustomExerciseDialog();
      }
    });
  }

  openAddCustomExerciseDialog(): void {
    const dialog = this.dependencies.tdServices.dialogService.open(AddCustomExerciseDialogComponent, {
      panelClass: AppConfig.DefaultDialogPanelClass
    });

    dialog.afterClosed().subscribe(m => {
      // open add workout exercise dialog if new custom exercise was created 
      if (dialog.componentInstance.newExercise) {
        this.openAddWorkoutExerciseDialog(dialog.componentInstance.newExercise);
      }
    });
  }

  openAddWorkoutExerciseDialog(exercise: Exercise): void {
    const data: any = {};
    data.workoutId = this.workout.id;
    data.exercise = exercise;

    const dialog = this.dependencies.tdServices.dialogService.open(AddWorkoutExerciseDialogComponent, {
      data: data,
      panelClass: AppConfig.DefaultDialogPanelClass
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
          });
      }
    });
  }

  private getInitObservable(): Observable<any> {
    // subscribe to drop events
    return this.dragulaService.drop
      .takeUntil(this.ngUnsubscribe)
      .do(() => this.startGlobalLoader())
      .debounceTime(500)
      .switchMap(() => {
        return this.dependencies.itemServices.workoutExerciseService.updateItemsOrder(this.sortedWorkoutExercises, this.workout.id).set();
      })
      .map(() => {
        super.stopGlobalLoader();
        super.showSavedSnackbar();
      });
  }

  private getWorkoutObservable(workoutId: number): Observable<any> {
    return this.dependencies.itemServices.workoutService.item()
      .byId(workoutId)
      .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
      .get()
      .map(response => {
        this.loadWorkout.next(response.item);

        this.assignWorkout(response.item);
      });
  }

  private assignWorkout(workout: Workout): void {
    // assign workout after all forms are ready and loaded + after ordering execises
    workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);
    this.sortedWorkoutExercises = workout.workoutExercises = workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);
    this.workout = workout;
  }

  deleteWorkoutExercise(workoutExercise: WorkoutExercise): void {
    this.startGlobalLoader();
    this.dependencies.itemServices.workoutExerciseService.delete(workoutExercise.id)
      .set()
      .do(() => this.startGlobalLoader())
      .subscribe(response => {
        // remove workout exercise from local letiable
        this.sortedWorkoutExercises = _.reject(this.sortedWorkoutExercises, function (item) { return item.id === response.deletedItemId; });

        this.showSavedSnackbar();

        this.stopGlobalLoader();
      },
      (error) => {
        this.stopGlobalLoader();
      });
  }

  private recalculateOrder(): void {
    if (this.sortedWorkoutExercises) {
      let order = 0;
      this.sortedWorkoutExercises.forEach(workoutExercise => {
        workoutExercise.order = order;
        order++;
      });
    }
  }
}
