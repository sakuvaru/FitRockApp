// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../web-components/data-list';
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormConfig, DynamicFormStatus } from '../../../../web-components/dynamic-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseComponent implements OnInit {

  public workoutExerciseForm: FormConfig<Exercise>;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  public customSaveButtonSubject: Subject<void> = new Subject<void>();
  public customDeleteButtonSubject: Subject<void> = new Subject<void>();
  public formStatus: DynamicFormStatus | undefined;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);
    
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
    this.workoutExerciseForm = this.dependencies.itemServices.exerciseService.insertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newExercise = response.item;
        this.close();
      }))
      .build();
  }

  public onStatusChanged(status: DynamicFormStatus): void {
    this.formStatus = status;
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
