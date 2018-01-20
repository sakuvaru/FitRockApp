import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { WorkoutsOverviewMenuItems } from '../menu.items';

@Component({
  templateUrl: 'client-workouts-page.component.html'
})
export class ClientWorkoutsPageComponent extends BasePageComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setConfig({
      menuTitle: { key: 'menu.workouts' },
      menuItems: new WorkoutsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.workouts.submenu.clientWorkouts' },
    });
  }
}
