// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { ProgressItemTypesOverviewMenuItem } from '../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { ProgressItemType } from '../../../models';

@Component({
  templateUrl: 'global-types-list.component.html'
})
export class GlobalTypesListComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<ProgressItemType>;

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

    this.setConfig({
      componentTitle: { key: 'module.progressItemTypes.submenu.globalTypes' },
      menuItems: new ProgressItemTypesOverviewMenuItem().menuItems,
      menuTitle: { key: 'module.progressItemTypes.submenu.overview' },
    });

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<ProgressItemType>(
      query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe);
      },
      searchTerm => {
        return this.dependencies.itemServices.progressItemTypeService.items()
          .whereEquals('IsGlobal', true)
          .include('ProgressItemUnit');
      },
      [
        {
          value: (item) => super.translate('module.progressItemTypes.globalTypes.' + item.typeName), flex: 40
        },
        {
          value: (item) =>
            super.translate('module.progressItemUnits.' + item.progressItemUnit.unitCode.toString())
          , isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true
        },
      ]
    )
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
      .showPager(true)
      .showSearch(false)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('progress-item-types/edit/') + item.id]))
      .build();
  }
}
