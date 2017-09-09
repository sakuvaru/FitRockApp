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
import { Observable } from 'rxjs/Rx';

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
    super.isDialog();
    this.workoutExercise = data;
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any> {
    return this.dependencies.itemServices.workoutExerciseService.editForm(this.workoutExercise.id)
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        form.onAfterUpdate((response) => {
          this.workoutExercise = response.item;
          this.close();
        });
        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedWorkoutExercise = response.deletedItemId;
          this.workoutExerciseWasDeleted = true;
          this.close();
        });

        this.workoutExerciseForm = form.build();
        super.stopGlobalLoader();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}