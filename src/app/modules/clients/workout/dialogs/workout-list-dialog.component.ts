import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../../core';
import { WorkoutExercise } from '../../../../models';

@Component({
  templateUrl: 'workout-list-dialog.component.html'
})
export class WorkoutListDialogComponent extends BaseDialogComponent<WorkoutListDialogComponent> implements OnInit {

  public workoutExercises: WorkoutExercise[];

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<WorkoutListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    this.workoutExercises = data.workoutExercises;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
