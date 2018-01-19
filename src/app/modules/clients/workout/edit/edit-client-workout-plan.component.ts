import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ComponentDependencyService } from '../../../../core';
import { Workout } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
  selector: 'mod-edit-client-workout-plan',
  templateUrl: 'edit-client-workout-plan.component.html'
})
export class EditClientWorkoutPlanComponent extends BaseClientModuleComponent implements OnInit {

  @Input() workoutId: number;

  @Output() loadWorkout = new EventEmitter<Workout>();

  public workout?: Workout;

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public handleLoadWorkout(workout: Workout): void {
    this.loadWorkout.next(workout);
  }
}
