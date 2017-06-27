// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { WorkoutMenuItems } from '../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Workout, WorkoutExercise } from '../../../models';
import { DragulaService } from 'ng2-dragula';
import { EditDialogComponent} from '../edit/edit-dialog.component';

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
        .disableCache(false)
        .includeMultiple(['WorkoutCategory', 'WorkoutExercises', 'WorkoutExercises.Exercise', 'WorkoutExercises.Exercise.ExerciseCategory'])
        .get())
      .subscribe(response => {

        this.workout = response.item;

        // sort exercises
        this.workout.workoutExercises.sort((n1,n2) => n1.order - n2.order);

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
    this.dependencies.itemServices.workoutExerciseService.updateItemsOrder(this.workout.workoutExercises, this.workout.id)
      .set()
      .subscribe();
  }
}