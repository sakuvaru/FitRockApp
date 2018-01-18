import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Exercise } from '../../../models';
import { WorkoutExercise } from '../../../models';

@Component({
  templateUrl: 'add-workout-exercise-dialog.component.html'
})
export class AddWorkoutExerciseDialogComponent extends BaseDialogComponent<AddWorkoutExerciseDialogComponent> implements OnInit {

  public workoutId: number;
  public exercise: Exercise;

  public workoutExerciseForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newWorkoutExercise: WorkoutExercise;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<AddWorkoutExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);


    this.workoutId = data.workoutId;
    this.exercise = data.exercise;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.buildInsertForm()
      .configField((field, item) => {
        if (field.key === 'ExerciseId') {
          field.value = this.exercise.id;
        } else if (field.key === 'WorkoutId') {
          field.value = this.workoutId;
        }
        return Observable.of(field);
      })
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newWorkoutExercise = response.item;
        this.close();
      }))
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
