// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../web-components/data-list';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { WorkoutExercise } from '../../../models';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-workout-exercise-dialog.component.html'
})
export class AddWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  public config: DataListConfig<WorkoutExercise>;
  public workoutId: number;
  public exercise: Exercise;

  public workoutExerciseForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newWorkoutExercise: WorkoutExercise;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    

    this.workoutId = data.workoutId;
    this.exercise = data.exercise;
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.buildInsertForm()
      .fieldValueResolver((fieldName, value) => {
        if (fieldName === 'ExerciseId') {
          return Observable.of(this.exercise.id);
        } else if (fieldName === 'WorkoutId') {
          return Observable.of(this.workoutId);
        }
        return Observable.of(value);
      })
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newWorkoutExercise = response.item;
        this.close();
      }))
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
