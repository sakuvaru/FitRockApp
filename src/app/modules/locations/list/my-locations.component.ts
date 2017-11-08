// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../core';

// required by component
import { LocationOverviewItems } from '../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Location } from '../../../models';

@Component({
  templateUrl: 'my-locations.component.html'
})
export class MyLocationsComponent extends BaseComponent implements OnInit {

  private config: DataListConfig<Location>;

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

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Location>(
      query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe);
      },
      searchTerm => {
        return this.dependencies.itemServices.locationService.items()
          .byCurrentUser()
          .whereLikeMultiple(['LocationName', 'Address'], searchTerm);
      },
      [
        { value: (item: Location) => item.locationName, flex: 60 },
      ]
    )
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('locations/view/') + item.id]))
      .build();
  }
}
