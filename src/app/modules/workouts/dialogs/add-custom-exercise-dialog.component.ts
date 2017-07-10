// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<Exercise>;

  private workoutExerciseForm: FormConfig<Exercise>;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();
    
    super.startGlobalLoader();

    this.dependencies.itemServices.exerciseService.insertForm()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(form => {
        form.onFormLoaded(() => super.stopGlobalLoader());
        form.onBeforeSave(() => super.startGlobalLoader());
        form.onAfterSave(() => super.stopGlobalLoader());
        form.onError(() => super.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newExercise = response.item;
          this.close();
        }))

        this.workoutExerciseForm = form.build();
      });
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}