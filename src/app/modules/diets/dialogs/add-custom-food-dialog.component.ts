// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Food } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'add-custom-food-dialog.component.html'
})
export class AddCustomFoodDialogComponent extends BaseComponent implements OnInit {

  private foodForm: FormConfig<Food>;

  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies)
  }

  ngOnInit() {
    super.ngOnInit();

    super.startGlobalLoader();

    this.dependencies.itemServices.foodService.insertForm()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(form => {
        form.onFormLoaded(() => super.stopGlobalLoader());
        form.onBeforeSave(() => super.startGlobalLoader());
        form.onAfterSave(() => super.stopGlobalLoader());
        form.onError(() => super.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newFood = response.item;
          this.close();
        }))

        this.foodForm = form.build();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}