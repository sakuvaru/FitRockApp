// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { MAT_DIALOG_DATA } from '@angular/material';
import { WorkoutExercise } from '../../../../models';

@Component({
  templateUrl: 'workout-list-dialog.component.html'
})
export class WorkoutListDialogComponent extends BaseComponent implements OnInit {

  private workoutExercises: WorkoutExercise[];

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    this.workoutExercises = data.workoutExercises;
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    };
}

  ngOnInit() {
    super.ngOnInit();
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
