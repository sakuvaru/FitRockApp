// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../lib/web-components';
import { Workout, WorkoutExercise } from '../../../models';

@Component({
  templateUrl: 'workout-plan.component.html'
})
export class WorkoutPlanComponent extends BaseComponent implements OnInit {

  private workout: Workout;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit() {
    this.activatedRoute.params
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .subscribe(response => {

        this.workout = response.item;
        console.log(response.item);

        this.setConfig({
          menuItems: new WorkoutMenuItems(response.item.id).menuItems,
          menuTitle: {
            key: response.item.workoutName
          },
          componentTitle: {
            'key': 'module.workouts.workoutPlan'
          }
        });
      });
  }
}