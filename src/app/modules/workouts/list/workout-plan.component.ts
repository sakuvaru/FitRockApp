// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Workout, WorkoutExercise } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/RX';
import { AddWorkoutExerciseDialogComponent } from '../dialogs/add-workout-exercise-dialog.component';
import { WorkoutsOverviewComponent } from './workouts-overview.component';

@Component({
  templateUrl: 'workout-plan.component.html'
})
export class WorkoutPlanComponent extends BaseComponent implements OnInit {

  private workout: Workout;

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

    // subscribe to drop events
    dragulaService.drop.subscribe((value) => {
      this.onDrop(this.workout.workoutExercises);
    });
  }

  ngOnInit() {
    this.startLoader();

    // init workout
    this.initWorkout();
  }

  private getExerciseFormObservables(workoutExercises: WorkoutExercise[]): Observable<FormConfig<WorkoutExercise>>[] {
    if (!workoutExercises) {
      return;
    }

    var observables: Observable<FormConfig<WorkoutExercise>>[] = [];

    workoutExercises.forEach(exercise => {
      var observable = this.dependencies.itemServices.workoutExerciseService.editForm(exercise.id)
        .map(form => {
          return this.exerciseForms[exercise.id] = form.build()
        });
      observables.push(observable);
    })

    return observables;
  }

  private initWorkout(): void {
    this.activatedRoute.params
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .disableCache(false)
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .subscribe(response => {

        this.setConfig({
          menuItems: new WorkoutMenuItems(response.item.id).menuItems,
          menuTitle: {
            key: response.item.workoutName
          },
          componentTitle: {
            'key': 'module.workouts.workoutPlan'
          }
        });

        // note - assign both workout & exercise forms once they are loaded

        // init edit workout exercise form from multiple observables
        var exerciseFormObservables = this.getExerciseFormObservables(response.item.workoutExercises);
        if (exerciseFormObservables && exerciseFormObservables.length > 0) {
          this.dependencies.coreServices.repositoryClient.mergeObservables(exerciseFormObservables)
            .subscribe(() => {
              this.assignWorkout(response.item);
              this.stopLoader();
            })
        }
        else {
          this.assignWorkout(response.item);
          this.startLoader();
        }
      });
  }

  private assignWorkout(workout: Workout): void {
    // assign workout after all forms are ready and loaded
    this.workout = workout

    // sort exercises
    this.workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);
  }

  private onDrop(orderedWorkoutExercises: WorkoutExercise[]) {
    this.dependencies.itemServices.workoutExerciseService.updateItemsOrder(this.workout.workoutExercises, this.workout.id)
      .set()
      .subscribe();
  }

  private addWorkoutExercise(): void{
    this.dependencies.tdServices.dialogService.open(AddWorkoutExerciseDialogComponent, {
      width: '70%',
    });
  }
}