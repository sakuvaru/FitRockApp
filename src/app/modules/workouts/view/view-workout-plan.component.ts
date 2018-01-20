import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Workout, WorkoutExercise } from '../../../models';

@Component({
  selector: 'mod-view-workout-plan',
  templateUrl: 'view-workout-plan.component.html'
})
export class ViewWorkoutPlanComponent extends BaseModuleComponent implements OnInit, OnChanges {

  @Output() loadWorkout = new EventEmitter();

  @Input() workoutId: number;

  public workout: Workout;
  public sortedWorkoutExercises: WorkoutExercise[];

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
      if (this.workoutId) {
        this.init();
      }
  }

  private init(): void {
    super.subscribeToObservable(this.initWorkoutObservable());
  }

  private initWorkoutObservable(): Observable<void> {
    return this.dependencies.itemServices.workoutService.item()
        .byId(this.workoutId)
        .disableCache(false)
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get()
      .takeUntil(this.ngUnsubscribe)
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
}
