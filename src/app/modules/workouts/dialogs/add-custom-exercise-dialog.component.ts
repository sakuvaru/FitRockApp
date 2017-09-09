// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Exercise } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'add-custom-exercise-dialog.component.html'
})
export class AddCustomExerciseDialogComponent extends BaseComponent implements OnInit {

  private workoutExerciseForm: FormConfig<Exercise>;

  /**
   * Accessed by parent component
   */
  public newExercise: Exercise;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
    super.isDialog();
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any>{
    return this.dependencies.itemServices.exerciseService.insertForm()
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newExercise = response.item;
          this.close();
        }))

        this.workoutExerciseForm = form.build();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}