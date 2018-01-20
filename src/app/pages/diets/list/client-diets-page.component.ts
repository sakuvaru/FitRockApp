import { Component, OnInit } from '@angular/core';

import { DataTableConfig, IDynamicFilter } from '../../../../web-components/data-table';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet } from '../../../models';
import { DietsOverviewMenuItems } from '../menu.items';

@Component({
  templateUrl: 'client-diets-page.component.html'
})
export class ClientDietsPageComponent extends BasePageComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  ngOnInit() {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'menu.diets' },
      menuItems: new DietsOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.diets.submenu.clientDiets' },
    });
  }
}
