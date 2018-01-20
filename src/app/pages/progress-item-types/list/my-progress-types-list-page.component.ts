import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { ProgressItemTypesOverviewMenuItem } from '../menu.items';

@Component({
  templateUrl: 'my-progress-types-list-page.component.html'
})
export class MyProgressTypesListPageComponent extends BasePageComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      componentTitle: { key: 'module.progressItemTypes.submenu.globalTypes' },
      menuItems: new ProgressItemTypesOverviewMenuItem().menuItems,
      menuTitle: { key: 'module.progressItemTypes.submenu.overview' },
    });
  }
}
