import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';

@Component({
  templateUrl: 'add-new-food-dialog.component.html'
})
export class AddNewFoodDialogComponent extends BaseDialogComponent<AddNewFoodDialogComponent> implements OnInit {

  public foodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<AddNewFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

  }

  ngOnInit() {
    super.ngOnInit();

    this.initForm();
  }

  private initForm(): void {
    this.foodForm = this.dependencies.itemServices.foodService.buildInsertForm()
      .wrapInCard(false)
      .onAfterInsert((response => {
        this.newFood = response.item;
        this.close();
      }))
      .optionLabelResolver((field, originalLabel) => {
        if (field.key === 'FoodCategoryId') {
          return super.translate('module.foodCategories.categories.' + originalLabel);
        } else if (field.key === 'FoodUnitId') {
          return super.translate('module.foodUnits.' + originalLabel).map(text => stringHelper.capitalizeText(text));
        }

        return Observable.of(originalLabel);
      })
      .configField((field, item) => {
        if (field.key === 'Language') {
          const language = this.currentLanguage;
          if (!language) {
            throw Error(`Language has to be set in order to create new foods`);
          }
          field.value = language.language.toString();
        }

        return Observable.of(field);
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
