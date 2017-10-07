// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { WorkoutExercise } from '../../../models';
import { FormConfig, DynamicFormStatus } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-workout-exercise-dialog.component.html'
})
export class EditWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private workoutExerciseForm: FormConfig<WorkoutExercise>;

  // public because it is accessed by parent component
  public workoutExercise: WorkoutExercise;

  public idOfDeletedWorkoutExercise: number;
  public workoutExerciseWasDeleted: boolean = false;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formStatus: DynamicFormStatus | undefined;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    super.isDialog();
    this.workoutExercise = data;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.editForm(this.workoutExercise.id)
      .onAfterUpdate((response) => {
        this.workoutExercise = response.item;
        this.close();
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterDelete((response) => {
        this.idOfDeletedWorkoutExercise = response.deletedItemId;
        this.workoutExerciseWasDeleted = true;
        this.close();
      })
      .build();
  }

  private onStatusChanged(status: DynamicFormStatus): void {
    this.formStatus = status;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}