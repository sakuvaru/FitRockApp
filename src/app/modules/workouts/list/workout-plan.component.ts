// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { Workout, WorkoutExercise } from '../../../models';

@Component({
  templateUrl: 'workout-plan.component.html'
})
export class WorkoutPlanComponent extends BaseComponent implements OnInit {

  private workout: Workout;
  private sortedWorkoutExercises: WorkoutExercise[];

  /**
  *access the form with 'id' of the exercise
  * e.g. exerciseForms['9']
  **/
  private exerciseForms = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    super.startLoader();

    // init workout
    this.initWorkout();
  }

  private initWorkout(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .disableCache(false)
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
        .takeUntil(this.ngUnsubscribe)
      .subscribe(response => {
        this.setConfig({
          menuItems: new WorkoutMenuItems(response.item.id).menuItems,
          menuTitle: {
            key: response.item.workoutName
          },
          componentTitle: {
            'key': 'module.workouts.previewWorkout'
          }
        });

        this.assignWorkout(response.item);
        super.stopLoader();
      });
  }

  private assignWorkout(workout: Workout): void {
    // assign workout after all forms are ready and loaded + after ordering execises
    workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);

    this.sortedWorkoutExercises = workout.workoutExercises = workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);

    this.workout = workout;
  }
}