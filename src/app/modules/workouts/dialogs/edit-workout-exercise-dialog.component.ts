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
import { FormConfig, DynamicFormStatus } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-workout-exercise-dialog.component.html'
})
export class EditWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  public workoutExerciseForm: FormConfig<WorkoutExercise>;

  // public because it is accessed by parent component
  public workoutExercise: WorkoutExercise;

  public idOfDeletedWorkoutExercise: number;
  public workoutExerciseWasDeleted: boolean = false;

  public customSaveButtonSubject: Subject<void> = new Subject<void>();
  public customDeleteButtonSubject: Subject<void> = new Subject<void>();
  public formStatus: DynamicFormStatus | undefined;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    
    this.workoutExercise = data;
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
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.editForm(this.workoutExercise.id)
      .wrapInCard(false)
      .onAfterUpdate((response) => {
        this.workoutExercise = response.item;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedWorkoutExercise = response.deletedItemId;
        this.workoutExerciseWasDeleted = true;
        this.close();
      })
      .build();
  }

  public onStatusChanged(status: DynamicFormStatus): void {
    this.formStatus = status;
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
