import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { ProgressItemTypesOverviewMenuItem } from '../menu.items';

@Component({
  templateUrl: 'global-types-list.component.html'
})
export class GlobalTypesListComponent extends BaseComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: false
    });
  }

  ngOnInit() {
    super.ngOnInit();

    this.init();
  }

  private init() {
    this.setConfig({
      componentTitle: { key: 'module.progressItemTypes.submenu.globalTypes' },
      menuItems: new ProgressItemTypesOverviewMenuItem().menuItems,
      menuTitle: { key: 'module.progressItemTypes.submenu.overview' },
    });
    this.config = this.dependencies.itemServices.progressItemTypeService.buildDataTable((query, search) => {
      return query
        .whereEquals('IsGlobal', true)
        .include('ProgressItemUnit');
    })
      .withFields([
        {
          value: (item) => item.isGlobal ? super.translate('module.progressItemTypes.globalTypes.' + item.typeName) : item.typeName,
          name: (item) => super.translate('module.progressItemTypes.typeName'),
          hideOnSmallScreen: false
        },
        {
          value: (item) => super.translate('module.progressItemUnits.' + item.progressItemUnit.unitCode.toString()),
          name: (item) => super.translate('module.progressItemTypes.unit'),
          hideOnSmallScreen: true
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated',
          hideOnSmallScreen: true
        }
      ])
      .onClick((item) => super.navigate([super.getTrainerUrl('progress-item-types/edit/') + item.id]))
      .build();
  }
}
