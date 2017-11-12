// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientOverviewMenuItems } from '../../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../../web-components/data-list';
import { User, UserFilterWithCount } from '../../../../models';
import { MultipleItemQuery } from '../../../../../lib/repository';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends ClientsBaseComponent implements OnInit {

  private config: DataListConfig<User>;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: true
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initDataList();
    super.initClientSubscriptions();
  }

  private initDataList(): void {
    this.setConfig({
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' },
    });

    this.config = this.dependencies.webComponentServices.dataListService.dataList<User>(
      searchTerm => {
        return this.dependencies.itemServices.userService.clients()
          .whereLikeMultiple(['FirstName', 'LastName'], searchTerm);
      },

    )
      .withFields([
        { value: (item) => item.getFullName(), flex: 40 },
        { value: (item) => item.email, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true },
      ])
      .showAllFilter(true)
      .filter(new Filter({
        filterNameKey: 'module.clients.activeClients',
        onFilter: query => query.whereEquals('IsActive', true),
        countQuery: (query) => query.toCountQuery()
      }))
      .filter(new Filter({
        filterNameKey: 'module.clients.inactiveClients',
        onFilter: query => query.whereEquals('IsActive', false),
        countQuery: (query) => query.toCountQuery()
      }))
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/' + item.id + '/dashboard')]))
      .avatarUrlResolver((item) => item.avatarUrl ? item.avatarUrl : AppConfig.DefaultUserAvatarUrl)
      .build();
  }
}
