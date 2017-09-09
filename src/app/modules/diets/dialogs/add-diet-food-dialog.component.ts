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
  templateUrl: 'add-diet-food-dialog.component.html'
})
export class AddDietFoodDialogComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<DietFood>;
  private dietId: number;
  private food: Food;

  private dietFoodForm: FormConfig<DietFood>;

  /**
   * Accessed by parent component
   */
  public newDietFood: DietFood;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    super.isDialog();

    this.dietId = data.dietId;
    this.food = data.food;
  }

  ngOnInit() {
    super.ngOnInit();
    
    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any> {
    return this.dependencies.itemServices.dietFoodService.insertForm()
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        // set food id & diet id for new DietFood manually
        form.withFieldValue('foodId', this.food.id);
        form.withFieldValue('dietId', this.dietId);

        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());

        form.onAfterInsert((response => {
          this.newDietFood = response.item;
          this.close();
        }))

        this.dietFoodForm = form.build();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}