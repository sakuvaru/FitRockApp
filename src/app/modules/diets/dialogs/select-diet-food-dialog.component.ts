import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectFoodDialogComponent } from 'app/modules/foods/dialogs/select-food-dialog.component';
import { IDynamicFilter } from 'web-components/data-table/data-table.builder';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseDialogComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';
import { QueryConditionField, QueryConditionType, QueryConditionJoin, QueryCondition } from 'lib/repository';


@Component({
  templateUrl: 'select-diet-food-dialog.component.html'
})
export class SelectDietFoodDialogComponent extends BaseDialogComponent<SelectFoodDialogComponent> implements OnInit {

  public selectable: boolean = true;
  public config?: DataTableConfig;

  public foods: boolean = false;
  public meals: boolean = false;
  public supplements: boolean = false;

  public selectedFood?: Food;
  public openAddNewFoodDialog: boolean = false;
  public openAddNewDishDialog: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<SelectFoodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies, dialogRef, data);

    this.foods = data.foods;
    this.meals = data.meals;
    this.supplements = data.supplements;
  }

  ngOnInit() {
    super.ngOnInit();

    this.config = this.dependencies.itemServices.foodService.buildDataTable(
      (query, search) => {

        if (this.foods) {
          // get only approved foods
          query = query.whereEquals('IsApproved', true);
        }

        query.whereComplex({
          leftSide: new QueryCondition({
            leftSide: [new QueryConditionField('IsGlobal', true, QueryConditionType.Equals)],
            rightSide: [new QueryConditionField('IsApproved', true, QueryConditionType.Equals)],
            join: QueryConditionJoin.And
          }) ,
          rightSide: [new QueryConditionField('CreatedByUserId', this.authUser ? this.authUser.id : 0, QueryConditionType.Equals)],
          join: QueryConditionJoin.Or
        });

        return query;
        /*
        return query
          .include('FoodCategory')
          .whereEquals('IsMeal', this.meals)
          .whereEquals('IsFood', this.foods)
          .whereEquals('IsSupplement', this.supplements)
          .whereLike('FoodName', search)
          .whereEqualsWithOr([{
            field: 'CreatedByUserId',
            value: this.authUser ? this.authUser.id : 0
          }, {
            field: 'IsGlobal',
            value: true
          }]);
          */
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
        foodName: search,
        isGlobalOrByCurrentUser: this.foods ? true : false, // get either global foods or the foods created by current user

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
