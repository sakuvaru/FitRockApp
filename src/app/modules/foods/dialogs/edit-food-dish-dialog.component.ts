import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { NewChildFoodVirtualModel } from 'app/models';
import { DataFormMultipleChoiceItem, DataFormConfig } from 'web-components/data-form';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';

@Component({
  templateUrl: 'edit-food-dish-dialog.component.html'
})
export class EditFoodDishDialogComponent extends BaseComponent implements OnInit {

  public items?: DataFormMultipleChoiceItem<NewChildFoodVirtualModel>[];

  public wrappers: ItemWrapper[] = [];

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);

    this.items = data.items;
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  confirm(): void {
    this.close();
  }

  ngOnInit() {
    super.ngOnInit();
    this.initDataForms();
  }

  private initDataForms(): void {
    // first prepare wrappers
    if (this.items && this.items.length > 0) {
      this.items.forEach(item => {
        if (!item.rawValue.foodDishId) {
          throw Error(`Id of food dish is missing. This might be a system error.`);
        }
        this.wrappers.push(new ItemWrapper(item.rawValue.foodDishId));
      });

      this.items.forEach(item => {
        if (!item.rawValue.foodDishId) {
          throw Error(`Id of food dish is missing. This might be a system error.`);
        }

        const wrapper = this.wrappers.find(m => m.dishFoodId === item.rawValue.foodDishId);

        if (!wrapper) {
          throw Error(`Wrapper for food dish is invalid. This is a system error`);
        }

        wrapper.formConfig = this.dependencies.itemServices.foodDishService.buildEditForm(
          this.dependencies.itemServices.foodDishService.editFormQuery(item.rawValue.foodDishId)
            .include('Food')
        )
          .onEditFormLoaded(form => {
            if (wrapper) {
              wrapper.title = form.item.food.foodName;
            }
          })
          .enableDelete(false)
          .wrapInCard(false)
          .build();
      });
    }
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}

class ItemWrapper {
  constructor(
    public dishFoodId: number,
    public formConfig?: DataFormConfig,
    public title?: string
  ) { }
}
