import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';
import { Food } from '../../../models';

@Component({
  selector: 'mod-all-foods-list',
  templateUrl: 'all-foods-list.component.html'
})
export class AllFoodsListComponent extends BaseModuleComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
    this.init();
  }

  private init() {
    this.config = this.dependencies.itemServices.foodService.buildDataTable((query, search) => {
      return query
        .include('FoodCategory')
        .whereEquals('IsMeal', false)
        .whereEquals('IsApproved', true)
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
      .withDynamicFilters(search => this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto({
        foodName: search,
        isGlobal: true,
        isApproved: true
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
      .onClick((item) => {
        if (item.isMeal) {
          this.dependencies.coreServices.navigateService.mealPreviewPage(item.id).navigate();
        } else {
          this.dependencies.coreServices.navigateService.foodPreviewPage(item.id).navigate();
        }
      })
      .build();
  }
}
