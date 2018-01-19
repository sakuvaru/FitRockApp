import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Workout, WorkoutExercise } from '../../../models';
import { WorkoutMenuItems } from '../menu.items';

@Component({
  templateUrl: 'workout-plan.component.html'
})
export class WorkoutPlanComponent extends BasePageComponent implements OnInit {

  public workout: Workout;
  public sortedWorkoutExercises: WorkoutExercise[];

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: false,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    // init workout
    super.subscribeToObservable(this.getItemObservable());
  }

  private getItemObservable(): Observable<any> {
    return this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .disableCache(false)
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .takeUntil(this.ngUnsubscribe)
      .map(response => {
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
      });
  }

  private assignWorkout(workout: Workout): void {
    // assign workout after all forms are ready and loaded + after ordering execises
    workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);

    this.sortedWorkoutExercises = workout.workoutExercises = workout.workoutExercises.sort((n1, n2) => n1.order - n2.order);

    this.workout = workout;
  }
}
