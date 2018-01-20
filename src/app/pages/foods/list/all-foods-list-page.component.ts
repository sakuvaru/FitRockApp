import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { FoodOverviewItems } from '../menu.items';

@Component({
  templateUrl: 'all-foods-list-page.component.html'
})
export class AllFoodsListPageComponent extends BasePageComponent implements OnInit {

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
    this.setConfig({
      menuTitle: { key: 'module.foods.submenu.allFoods' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });
  }
}
