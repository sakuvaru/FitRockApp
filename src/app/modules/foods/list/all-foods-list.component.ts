// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { FoodOverviewItems } from '../menu.items';
import { IDynamicFilter, DataTableConfig } from '../../../../web-components/data-table';
import { Food, FoodCategoryWithFoodsCountDto } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'all-foods-list.component.html'
})
export class AllFoodsListComponent extends BaseComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: true
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.init();
  }

  private init() {
    this.setConfig({
      menuTitle: { key: 'module.foods.submenu.allFoods' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });
    this.config = this.dependencies.itemServices.foodService.buildDataTable((query, search) => {
      return query
        .include('FoodCategory')
        .whereLike('FoodName', search);
    })
      .withFields([
        {
          value: (item) => item.foodName,
          name: (item) => super.translate('module.foods.foodName'),
          sortKey: 'FoodName'
        },
        {
          value: (item) => item.foodCategory.categoryName,
          name: (item) => super.translate('module.foods.foodCategory'),
          sortKey: 'FoodCategory.CategoryName'
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated'
        }
      ])
      .withDynamicFilters(search => this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto(search, true)
        .get()
        .map(response => {
          const filters: IDynamicFilter<Food>[] = [];
          response.items.forEach(category => {
            filters.push(({
              guid: category.id.toString(),
              name: Observable.of(category.codename),
              query: (query) => query.whereEquals('FoodCategoryId', category.id),
              count: category.foodsCount
            }));
          });
          return filters;
        }))
      .onClick((item) => super.navigate([super.getTrainerUrl('foods/preview/') + item.id]))
      .build();
  }
}
