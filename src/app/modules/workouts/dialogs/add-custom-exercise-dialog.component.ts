// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Exercise } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseComponent implements OnInit {

  public workoutExerciseForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.workoutExerciseForm = this.dependencies.itemServices.exerciseService.buildInsertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newExercise = response.item;
        this.close();
      }))
      .renderButtons(false)
      .optionLabelResolver((field, label) => {
        if (field.key === 'ExerciseCategoryId') {
            return super.translate(`module.exerciseCategories.categories.${label}`);
        }

        return Observable.of(label);
    })
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
