// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { LocationOverviewItems } from '../menu.items';
import { DataTableConfig } from '../../../../web-components/data-table';
import { Location } from '../../../models';

@Component({
  templateUrl: 'my-locations.component.html'
})
export class MyLocationsComponent extends BaseComponent implements OnInit {

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

    this.setConfig({
      menuTitle: { key: 'module.locations.submenu.overview' },
      menuItems: new LocationOverviewItems().menuItems,
      componentTitle: { key: 'module.locations.submenu.myLocations' },
    });

    this.config = this.dependencies.itemServices.locationService.buildDataTable(
      (query, search) => {
        return query
          .byCurrentUser()
          .whereLikeMultiple(['LocationName', 'Address'], search);
      },
    )
      .withFields([
        {
          value: (item) => item.locationName,
          name: (item) => super.translate('module.locations.locationName'),
          sortKey: 'LocationName'
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated'
        }
      ])
      .onClick((item) => super.navigate([super.getTrainerUrl('locations/view/') + item.id]))
      .build();
  }
}
