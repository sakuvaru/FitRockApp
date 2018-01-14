import { Component, OnInit } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';

@Component({
  templateUrl: 'add-new-dish-dialog.component.html'
})
export class AddNewDishDialogComponent extends BaseComponent implements OnInit {

  public foodForm: DataFormConfig;

  /**
   * Accessed by parent component
   */
  public newFood: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
  ) {
    super(dependencies);

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
