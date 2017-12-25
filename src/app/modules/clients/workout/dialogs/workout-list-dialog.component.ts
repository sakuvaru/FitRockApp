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

  public workoutExercises: WorkoutExercise[];

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
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
