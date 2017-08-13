// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditWorkoutMenuItems } from '../../menu.items';
import { Workout } from '../../../../models';

@Component({
  templateUrl: 'edit-client-workout-plan.component.html'
})
export class EditClientWorkoutPlanComponent extends ClientsBaseComponent implements OnInit {

  private workoutId: number;
  private workout: Workout;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute)
  }

  ngOnInit() {
    super.ngOnInit();

    this.initWorkoutId();
    super.initClientSubscriptions();
  }

  private initWorkoutId(): void {
    this.activatedRoute.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
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
        'key': 'module.clients.workout.editPlan'
      }
    });
  }
}