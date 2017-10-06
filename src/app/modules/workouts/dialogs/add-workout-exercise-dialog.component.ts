// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { WorkoutExercise } from '../../../models';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-workout-exercise-dialog.component.html'
})
export class AddWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<WorkoutExercise>;
  private workoutId: number;
  private exercise: Exercise;

  private workoutExerciseForm: FormConfig<WorkoutExercise>;

  /**
   * Accessed by parent component
   */
  public newWorkoutExercise: WorkoutExercise;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formIsValid: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    super.isDialog();

    this.workoutId = data.workoutId;
    this.exercise = data.exercise;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.workoutExerciseService.insertForm()
      .fieldValueResolver((fieldName, value) => {
        if (fieldName === 'ExerciseId') {
          return this.exercise.id;
        }
        else if (fieldName === 'WorkoutId') {
          return this.workoutId;
        }
        return value;
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterInsert((response => {
        this.newWorkoutExercise = response.item;
        this.close();
      }))
      .build();
  }

  private onStatusChanged(valid: boolean): void {
    this.formIsValid = valid;
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}