// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';

@Component({
  templateUrl: 'edit-client-workout-plan.component.html'
})
export class EditClientWorkoutPlanComponent extends BaseComponent implements OnInit {

  private clientId: number;
  private workoutId: number;
  private workout: Workout;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.clientId = +params['id'];
        this.workoutId = +params['workoutId'];
      });
  }

  private handleLoadWorkout(workout: Workout): void {
    this.setConfig({
      menuItems: new ClientEditWorkoutMenuItems(this.clientId, this.workoutId).menuItems,
      menuTitle: {
        key: workout.workoutName
      },
      componentTitle: {
        'key': 'module.workouts.editPlan'
      }
    });
  }
}