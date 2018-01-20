import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { WorkoutExercise } from '../../../models';

@Component({
  templateUrl: 'edit-workout-exercise-dialog.component.html'
})
export class EditWorkoutExerciseDialogComponent extends BaseDialogComponent<EditWorkoutExerciseDialogComponent> implements OnInit {

  public workoutExerciseForm: DataFormConfig;

  // public because it is accessed by parent component
  public workoutExercise: WorkoutExercise;

  public idOfDeletedWorkoutExercise: number;
  public workoutExerciseWasDeleted: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<EditWorkoutExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

    this.workoutExercise = data;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.buildEditForm(this.workoutExercise.id)
      .wrapInCard(false)
      .onAfterEdit((response) => {
        this.workoutExercise = response.item;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedWorkoutExercise = response.deletedItemId;
        this.workoutExerciseWasDeleted = true;
        this.close();
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
