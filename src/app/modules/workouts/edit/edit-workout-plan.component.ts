// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { Workout } from '../../../models';

@Component({
  templateUrl: 'edit-workout-plan.component.html'
})
export class EditWorkoutPlanComponent extends BaseComponent implements OnInit, OnDestroy {

  public workoutId: number;
  public workout: Workout;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
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
