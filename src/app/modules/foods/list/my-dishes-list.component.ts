import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Food } from '../../../models';
import { FoodOverviewItems } from '../menu.items';

@Component({
  templateUrl: 'my-dishes-list.component.html'
})
export class MyDishesListComponent extends BaseComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.init();
  }

  private init() {
    this.setConfig({
      menuTitle: { key: 'module.foods.submenu.myDishes' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });
    this.config = this.dependencies.itemServices.foodService.buildDataTable((query, search) => {
      return query
        .include('FoodCategory')
        .byCurrentUser()
        .whereEquals('IsDishFood', true)
        .whereLike('FoodName', search);
    })
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
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated',
          hideOnSmallScreen: true
        }
      ])
      .withDynamicFilters(search => this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto(search, true, false, true, false)
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
      .onClick((item) => super.navigate([super.getTrainerUrl('foods/dishes/preview/') + item.id]))
      .build();
  }
}
