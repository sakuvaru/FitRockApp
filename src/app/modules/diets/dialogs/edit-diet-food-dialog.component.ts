// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Food, DietFood } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';

@Component({
  templateUrl: 'edit-diet-food-dialog.component.html'
})
export class EditDietFoodDialogComponent extends BaseComponent implements OnInit {

  private dietFoodForm: FormConfig<DietFood>;

  // public because it is accessed by parent component
  public dietFood: DietFood;

  public idOfDeletedDietFood: number;
  public dietFoodWasDeleted: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    this.dietFood = data;
  }

  ngOnInit() {
    super.ngOnInit();
    
    super.startGlobalLoader();

    this.dependencies.itemServices.dietFoodService.editForm(this.dietFood.id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(form => {
        form.onAfterUpdate((response) => {
          this.dietFood = response.item;
          this.close();
        });
        form.onBeforeSave(() => super.startGlobalLoader());
        form.onAfterSave(() => super.stopGlobalLoader());
        form.onBeforeDelete(() => super.startGlobalLoader());
        form.onError(() => super.stopGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedDietFood = response.deletedItemId;
          this.dietFoodWasDeleted = true;
          this.stopGlobalLoader();
          this.close();
        });

        this.dietFoodForm = form.build();
        super.stopGlobalLoader();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}