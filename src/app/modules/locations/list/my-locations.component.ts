import { Component, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../web-components/data-table';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
  selector: 'mod-my-locations',
  templateUrl: 'my-locations.component.html'
})
export class MyLocationsComponent extends BaseModuleComponent implements OnInit {

  public config: DataTableConfig;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies);
  }


  ngOnInit() {
    super.ngOnInit();
  
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
          sortKey: 'LocationName',
          hideOnSmallScreen: false
        },
        {
          name: (item) => super.translate('shared.updated'),
          value: (item) => super.fromNow(item.updated),
          sortKey: 'Updated',
          hideOnSmallScreen: true
        }
      ])
      .onClick((item) => super.navigate([super.getTrainerUrl('locations/view/') + item.id]))
      .build();
  }
}
