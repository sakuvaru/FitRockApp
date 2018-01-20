import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { DietFood } from '../../../models';

@Component({
  templateUrl: 'edit-diet-food-dialog.component.html'
})
export class EditDietFoodDialogComponent extends BaseDialogComponent<EditDietFoodDialogComponent> implements OnInit {

  public dietFoodForm: DataFormConfig;

  // public because it is accessed by parent component
  public dietFood: DietFood;

  public idOfDeletedDietFood: number;
  public dietFoodWasDeleted: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<EditDietFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
    

    this.dietFood = data;
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
    this.dietFoodForm = this.dependencies.itemServices.dietFoodService.buildEditForm(this.dietFood.id)
      .wrapInCard(false)
      .fieldLabelResolver((field, originalLabel) => {
        if (field.key === 'UnitValue') {
          return this.dependencies.itemServices.foodUnitService.item().byId(this.dietFood.food.foodUnitId)
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
      .onAfterEdit((response) => {
        this.dietFood = response.item;
        this.close();
      })
      .onAfterDelete((response) => {
        this.idOfDeletedDietFood = response.deletedItemId;
        this.dietFoodWasDeleted = true;
        this.close();
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
