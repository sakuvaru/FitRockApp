import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { DietFood, Food } from '../../../models';

@Component({
  templateUrl: 'add-diet-food-dialog.component.html'
})
export class AddDietFoodDialogComponent extends BaseDialogComponent<AddDietFoodDialogComponent> implements OnInit {

  public dietId: number;
  public food: Food;

  public dietFoodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newDietFood: DietFood;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<AddDietFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);


    this.dietId = data.dietId;
    this.food = data.food;
  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.buildInsertForm()
      .configField((field, item) => {
        if (field.key === 'FoodId') {
          field.value = this.food.id;
        } else if (field.key === 'DietId') {
          field.value = this.dietId;
        }
        return Observable.of(field);
      })
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'Amount') {
          return this.dependencies.itemServices.foodUnitService.item().byId(this.food.foodUnitId)
            .get()
            .flatMap(response => {
              if (response.isEmpty()) {
                console.warn(`FoodUnit was not found, this should have not happened here`);
                return Observable.of(originalLabel);
              }
              return super.translate('module.foodUnits.pluralTwo.' + response.item.unitCode)
                .map(unitTranslation => originalLabel + ' - ' + unitTranslation + '');
            });
        }
        return Observable.of(originalLabel);
      })
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newDietFood = response.item;
        super.close();
      }))
      .renderButtons(false)
      .build();
  }
}
