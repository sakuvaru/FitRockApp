// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataListConfig, AlignEnum } from '../../../../web-components/data-list';
import { Food, DietFood } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';
import { stringHelper } from '../../../../lib/utilities';

@Component({
  templateUrl: 'add-diet-food-dialog.component.html'
})
export class AddDietFoodDialogComponent extends BaseComponent implements OnInit {

  public config: DataListConfig<DietFood>;
  public dietId: number;
  public food: Food;

  public dietFoodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newDietFood: DietFood;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
    

    this.dietId = data.dietId;
    this.food = data.food;
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
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.buildInsertForm()
      .fieldValueResolver((fieldName, value) => {
        if (fieldName === 'FoodId') {
          return Observable.of(this.food.id);
        } else if (fieldName === 'DietId') {
          return Observable.of(this.dietId);
        }
        return Observable.of(value);
      })
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'UnitValue') {
          return this.dependencies.itemServices.foodUnitService.item().byId(this.food.foodUnitId)
            .get()
            .flatMap(response => {
              if (response.isEmpty()) {
                console.warn(`FoodUnit was not found, this should have not happened here`);
                return Observable.of(originalLabel);
              }
              return super.translate('module.foodUnits.' + response.item.unitCode)
                .map(unitTranslation => originalLabel + ' (' + unitTranslation + ')');
            });
        }
        return Observable.of(originalLabel);
      })
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newDietFood = response.item;
        this.close();
      }))
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
