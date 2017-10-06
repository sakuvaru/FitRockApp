// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseComponent implements OnInit {

  private workoutExerciseForm: FormConfig<Exercise>;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  private customSaveButtonSubject: Subject<void> = new Subject<void>();
  private customDeleteButtonSubject: Subject<void> = new Subject<void>();
  private formIsValid: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
    super.isDialog();
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.exerciseService.insertForm()
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .onAfterInsert((response => {
        this.newExercise = response.item;
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