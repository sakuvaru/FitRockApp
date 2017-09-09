// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../web-components/data-table';
import { Food, DietFood } from '../../../models';
import { MD_DIALOG_DATA } from '@angular/material';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

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
    super.isDialog();

    this.dietFood = data;
  }

  ngOnInit() {
    super.ngOnInit();
    
    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any> {
    return this.dependencies.itemServices.dietFoodService.editForm(this.dietFood.id)
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        form.onAfterUpdate((response) => {
          this.dietFood = response.item;
          this.close();
        });
        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedDietFood = response.deletedItemId;
          this.dietFoodWasDeleted = true;
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