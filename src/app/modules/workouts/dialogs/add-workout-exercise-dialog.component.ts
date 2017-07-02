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
  templateUrl: 'add-workout-exercise-dialog.component.html'
})
export class AddWorkoutExerciseDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Exercise>;
  private workoutId: number;
  private exercise: Exercise;

  private workoutExerciseForm: FormConfig<WorkoutExercise>;

  /**
   * Accessed by parent component
   */
  public newWorkoutExercise: WorkoutExercise;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)

    this.workoutId = data.workoutId;
    this.exercise = data.exercise;
  }

  ngOnInit() {
    this.startGlobalLoader();

    this.dependencies.itemServices.workoutExerciseService.insertForm()
      .subscribe(form => {
        form.onFormLoaded(() => this.stopGlobalLoader());
        // set exercise id & workout id for new WorkoutExercise item
        form.withFieldValue('exerciseId', this.exercise.id);
        form.withFieldValue('workoutId', this.workoutId);
        form.onBeforeSave(() => this.startGlobalLoader());
        form.onAfterSave(() => this.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newWorkoutExercise = response.item;
          this.close();
        }))

        this.workoutExerciseForm = form.build();
      });
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }

}