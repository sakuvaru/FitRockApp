// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { Workout } from '../../../models';

@Component({
  templateUrl: 'edit-workout-plan.component.html'
})
export class EditWorkoutPlanComponent extends BasePageComponent implements OnInit, OnDestroy {

  public workoutId: number;
  public workout: Workout;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.workoutId = +params['id'];
      });
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
