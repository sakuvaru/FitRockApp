import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IDynamicFilter } from 'web-components/data-table/data-table.builder';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';

@Component({
  templateUrl: 'select-food-dialog.component.html'
})
export class SelectFoodDialogComponent extends BaseDialogComponent<SelectFoodDialogComponent> implements OnInit {

  public config?: DataTableConfig;

  public selectedFood?: Food;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<SelectFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);
  }

  ngOnInit() {
    super.ngOnInit();

    this.config = this.dependencies.itemServices.foodService.buildDataTable(
      (query, search) => {
        return query
          .includeMultiple(['FoodCategory', 'FoodUnit'])
          .whereEquals('IsMeal', false)
          .whereEqualsWithOr([{
            field: 'CreatedByUserId',
            value: this.authUser ? this.authUser.id : 0
          }, {
            field: 'IsGlobal',
            value: true
          }])
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
          value: (item) => super.translate('module.foodCategories.categories.' + item.foodCategory.codename),
          name: (item) => super.translate('module.foods.foodCategory'),
          hideOnSmallScreen: true
        },
      ])
      .withDynamicFilters(search => this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto(search, false, false, false, false)
        .get()
        .map(response => {
          const filters: IDynamicFilter<Food>[] = [];
          response.items.forEach(category => {
            filters.push(({
              guid: category.id.toString(),
              name: super.translate('module.foodCategories.categories.' + category.codename),
              query: (query) => query.whereEquals('FoodCategoryId', category.id),
              count: category.foodsCount
            }));
          });
          return filters;
        }))
      .pageSize(5)
      .renderPager(false)
      .onClick((item: Food) => {
        // assign selected item
        this.selectedFood = item;
        this.close();
      })
      .build();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
