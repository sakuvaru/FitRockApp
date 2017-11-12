// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { FoodOverviewItems } from '../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Food, FoodCategoryWithFoodsCountDto } from '../../../models';

@Component({
  templateUrl: 'all-foods-list.component.html'
})
export class AllFoodsListComponent extends BaseComponent implements OnInit {

  private config: DataListConfig<Food>;

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

    this.setConfig({
      menuTitle: { key: 'module.foods.submenu.allFoods' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Food>(
      searchTerm => {
        return this.dependencies.itemServices.foodService.items()
          .include('FoodCategory')
          .whereLike('FoodName', searchTerm);
      },
    )
      .withFields([
        { value: (item) => item.foodName, flex: 40 },
        {
          value: (item) => {
            return item.foodCategory.categoryName;
          }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ])
      .dynamicFilters((searchTerm) => {
        return this.dependencies.itemServices.foodCategoryService.getFoodCategoryWithFoodsCountDto(searchTerm, true)
          .get()
          .map(response => {
            const filters: Filter<FoodCategoryWithFoodsCountDto>[] = [];
            response.items.forEach(category => {
              filters.push(new Filter({
                filterNameKey: category.codename,
                onFilter: (query) => query.whereEquals('FoodCategoryId', category.id),
                count: category.foodsCount
              }));
            });
            return filters;
          })
          .takeUntil(this.ngUnsubscribe);
      })
      .showAllFilter(true)
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('foods/preview/') + item.id]))
      .build();
  }
}
