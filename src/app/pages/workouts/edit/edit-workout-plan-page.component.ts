import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { Workout } from '../../../models';
import { WorkoutMenuItems } from '../menu.items';

@Component({
  templateUrl: 'edit-workout-plan-page.component.html'
})
export class EditWorkoutPlanPageComponent extends BasePageComponent implements OnInit {

  public workoutId?: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies, activatedRoute);
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(
      this.activatedRoute.params
        .map(params => {
          this.workoutId = +params['id'];
        })
    );
  }

  public handleLoadWorkout(workout: Workout): void {
    this.setConfig({
      menuItems: new WorkoutMenuItems(workout.id).menuItems,
      menuTitle: {
        key: workout.workoutName
      },
      componentTitle: {
        'key': 'module.workouts.editPlan'
      }
    });
  }
}
