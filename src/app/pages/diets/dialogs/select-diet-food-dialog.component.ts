import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectFoodDialogComponent } from 'app/modules/foods/dialogs/select-food-dialog.component';
import { IDynamicFilter } from 'web-components/data-table/data-table.builder';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';

@Component({
  templateUrl: 'select-diet-food-dialog.component.html'
})
export class SelectDietFoodDialogComponent extends BaseDialogComponent<SelectFoodDialogComponent> implements OnInit {

  public selectable: boolean = true;
  public config?: DataTableConfig;

  /**
   * Indicates if foods or food dishes are fetched
   */
  public takeFoodDishes: boolean = false;

  public selectedFood?: Food;
  public openAddNewFoodDialog: boolean = false;
  public openAddNewDishDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<SelectFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

    this.takeFoodDishes = data.takeFoodDishes;
  }

  ngOnInit() {
    super.ngOnInit();

    console.log('TODO!! Fix filters here');

    this.config = this.dependencies.itemServices.foodService.buildDataTable(
      (query, search) => {
        return query
          .include('FoodCategory')
          .whereEquals('IsMeal', this.takeFoodDishes)
          .whereLike('FoodName', search)
          .whereEqualsWithOr([{
            field: 'CreatedByUserId',
            value: this.authUser ? this.authUser.id : 0
          }, {
            field: 'IsGlobal',
            value: true
          }]);
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
      .withDynamicFilters(search => this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto({
        foodName: search
      })
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

  public newFood(): void {
    this.openAddNewFoodDialog = true;
    this.close();
  }

  public newDish(): void {
    this.openAddNewDishDialog = true;
    this.close();
  }

  public close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}
