import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { FoodOverviewItems } from '../menu.items';

@Component({
  templateUrl: 'my-supplements-list-page.component.html'
})
export class MySupplementsListPageComponent extends BasePageComponent implements OnInit {

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
      menuTitle: { key: 'module.foods.submenu.mySupplements' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });
  }
}


