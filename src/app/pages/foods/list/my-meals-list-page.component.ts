import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { FoodOverviewItems } from '../menu.items';

@Component({
  templateUrl: 'my-meals-list-page.component.html'
})
export class MyMealsListPageComponent extends BasePageComponent implements OnInit {

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
      menuTitle: { key: 'module.foods.submenu.myMeals' },
      menuItems: new FoodOverviewItems().menuItems,
      componentTitle: { key: 'module.foods.submenu.overview' },
    });
  }
}
