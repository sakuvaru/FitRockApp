// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../lib/web-components';
import { Workout, WorkoutExercise } from '../../../models';
import { DragulaService } from 'ng2-dragula';

@Component({
  templateUrl: 'workout-plan.component.html'
})
export class WorkoutPlanComponent extends BaseComponent implements OnInit {

  private workout: Workout;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dragulaService: DragulaService,
    protected dependencies: ComponentDependencyService) {
    super(dependencies)

    // subscribe to drop events
    dragulaService.drop.subscribe((value) => {
      this.onDrop(this.workout.workoutExercises);
    });
  }

  ngOnInit() {
    this.activatedRoute.params
      .switchMap((params: Params) => this.dependencies.itemServices.workoutService.item()
        .byId(+params['id'])
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .subscribe(response => {

        this.workout = response.item;

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

  private onDrop(orderedWorkoutExercises: WorkoutExercise[]) {
    this.dependencies.itemServices.workoutExerciseService.post('updateOrder')
      .withJsonData(this.getExerciseOrderJson())
      .set()
      .subscribe();
  }

  private getExerciseOrderJson(): OrderItem[] {
    var data: OrderItem[] = [];
    if (this.workout.workoutExercises) {
      for (var i = 0; i < this.workout.workoutExercises.length; i++) {
        var workoutExercise = this.workout.workoutExercises[i];
        data.push(new OrderItem(workoutExercise.id, i));
      }
    }
    return data;
  }
}

class OrderItem {
  constructor(
    public orderExerciseId: number,
    public position: number
  ) { }
}