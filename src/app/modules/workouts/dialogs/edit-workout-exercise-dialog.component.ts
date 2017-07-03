// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { WorkoutExercise } from '../../../models';
import { FormConfig } from '../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'edit-workout-exercise-dialog.component.html'
})
export class EditWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private workoutExerciseForm: FormConfig<WorkoutExercise>;

  // public because it is accessed by parent component
  public workoutExercise: WorkoutExercise;

  public idOfDeletedWorkoutExercise: number;
  public workoutExerciseWasDeleted: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    this.workoutExercise = data;
  }

  ngOnInit() {
    this.startGlobalLoader();

    this.dependencies.itemServices.workoutExerciseService.editForm(this.workoutExercise.id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(form => {
        form.onAfterUpdate((response) => {
          this.workoutExercise = response.item;
          this.close();
        });
        form.onBeforeSave(() => this.startGlobalLoader());
        form.onAfterSave(() => this.stopGlobalLoader());
        form.onBeforeDelete(() => this.startGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedWorkoutExercise = response.deletedItemId;
          this.workoutExerciseWasDeleted = true;
          this.stopGlobalLoader();
          this.close();
        });

        this.workoutExerciseForm = form.build();
        this.stopGlobalLoader();
      });
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}