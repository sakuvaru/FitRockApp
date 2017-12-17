// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ProgressItemTypesOverviewMenuItem } from '../menu.items';
import { DataTableConfig } from '../../../../web-components/data-table';
import { ProgressItemType } from '../../../models';

@Component({
  templateUrl: 'my-types-list.component.html'
})
export class MyTypesListComponent extends BaseComponent implements OnInit {

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
      componentTitle: { key: 'module.progressItemTypes.submenu.globalTypes' },
      menuItems: new ProgressItemTypesOverviewMenuItem().menuItems,
      menuTitle: { key: 'module.progressItemTypes.submenu.overview' },
    });
    this.config = this.dependencies.itemServices.progressItemTypeService.buildDataTable((query, search) => {
      return query
        .whereEquals('IsGlobal', false)
        .byCurrentUser()
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
          hideOnSmallScreen: false
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
