import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-my-progress-types-list',
  templateUrl: 'my-progress-types-list.component.html'
})
export class MyProgressTypesListComponent extends BaseModuleComponent implements OnInit {

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
