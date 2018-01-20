import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Exercise } from '../../../models';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseDialogComponent<AddCustomExerciseDialogComponent> implements OnInit {

  public workoutExerciseForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<AddCustomExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.exerciseService.buildInsertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newExercise = response.item;
        this.close();
      }))
      .renderButtons(false)
      .optionLabelResolver((field, label) => {
        if (field.key === 'ExerciseCategoryId') {
            return super.translate(`module.exerciseCategories.categories.${label}`);
        }

        return Observable.of(label);
    })
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
