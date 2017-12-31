// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Observable, Subject } from 'rxjs/Rx';
import { stringHelper } from 'lib/utilities';

@Component({
  templateUrl: 'add-custom-food-dialog.component.html'
})
export class AddCustomFoodDialogComponent extends BaseComponent implements OnInit {

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
      .fieldValueResolver((fieldName, value) => {
        if (fieldName === 'Language') {
          const language = this.currentLanguage;
          if (!language) {
            throw Error(`Language has to be set in order to create new foods`);
          }
          return Observable.of(language.language.toString());
        }

        return Observable.of(value);
      })
      .renderButtons(false)
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
