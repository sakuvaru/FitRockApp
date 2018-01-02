import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { DietFood, Food } from '../../../models';

@Component({
  templateUrl: 'add-diet-food-dialog.component.html'
})
export class AddDietFoodDialogComponent extends BaseComponent implements OnInit {

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
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
