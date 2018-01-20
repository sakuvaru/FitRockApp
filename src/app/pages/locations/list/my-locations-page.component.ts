import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { LocationOverviewItems } from '../menu.items';

@Component({
  templateUrl: 'my-locations-page.component.html'
})
export class MyLocationsPageComponent extends BasePageComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'module.locations.submenu.overview' },
      menuItems: new LocationOverviewItems().menuItems,
      componentTitle: { key: 'module.locations.submenu.myLocations' },
    });
  }
}
