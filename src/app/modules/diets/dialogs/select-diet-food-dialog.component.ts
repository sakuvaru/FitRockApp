// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataTableConfig } from '../../../../web-components/data-table';
import { Food } from '../../../models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: 'select-diet-food-dialog.component.html'
})
export class SelectDietFoodDialogComponent extends BaseComponent implements OnInit {

  public selectable: boolean = true;
  public config?: DataTableConfig;

  public selectedFood?: Food;
  public openAddCustomFoodDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MAT_DIALOG_DATA) public data: any
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

    this.config = this.dependencies.itemServices.foodService.buildDataTable(
      (query, search) => {
        return query
          .include('FoodCategory')
          .whereLike('FoodName', search);
      },
    )
      .withFields([
        {
          value: (item) => item.foodName,
          name: (item) => super.translate('module.foods.foodName'),
          sortKey: 'FoodName',
          hideOnSmallScreen: false
        },
        {
          value: (item) => super.translate('module.foodCategories.' + item.foodCategory.codename),
          name: (item) => super.translate('module.foods.foodCategory'),
          hideOnSmallScreen: true
        },
      ])
      .withFilters([
        {
          guid: 'allFoods',
          name: super.translate('module.diets.allFoods'),
          query: query => query
        },
        {
          guid: 'myFoods',
          name: super.translate('module.diets.myFoods'),
          query: query => query.byCurrentUser().whereEquals('IsGlobal', false)
        }
      ])
      .pageSize(5)
      .renderPager(false)
      .onClick((item: Food) => {
        // assign selected item
        this.selectedFood = item;
        this.close();
      })
      .build();
  }

  public addCustomFood(): void {
    this.openAddCustomFoodDialog = true;
    this.close();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
