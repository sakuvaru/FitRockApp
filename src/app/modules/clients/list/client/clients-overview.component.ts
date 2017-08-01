// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientOverviewMenuItems } from '../../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../../web-components/data-table';
import { User, UserFilterWithCount } from '../../../../models';
import { MultipleItemQuery } from '../../../../../lib/repository';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseComponent implements OnInit {

  private config: DataTableConfig<User>;

  constructor(
    protected dependencies: ComponentDependencyService) {
    super(dependencies)
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.setConfig({
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' },
    });

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<User>()
      .fields([
        { label: 'Klient', value: (item) => { return item.getFullName() }, flex: 40 },
        { label: 'E-mail', value: (item) => { return item.email }, isSubtle: true, align: AlignEnum.Right, hideOnSmallScreens: true },
      ])
      .loadQuery(searchTerm => {
        return this.dependencies.itemServices.userService.clients()
          .WhereLikeMultiple(["FirstName", "LastName"], searchTerm)
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .onBeforeLoad(() => super.startLoader())
      .onAfterLoad(() => {
        super.stopLoader();
      })
      .showAllFilter(true)
      .filter(new Filter({
        filterNameKey: 'module.clients.activeClients',
        onFilter: query => query.whereEquals('IsActive', true),
        countQuery: (query) => query.toCountQuery().withCustomAction('GetClientsCount')
      }))
      .filter(new Filter({
        filterNameKey: 'module.clients.inactiveClients',
        onFilter: query => query.whereEquals('IsActive', false),
        countQuery: (query) => query.toCountQuery().withCustomAction('GetClientsCount')
      }))
      .showPager(true)
      .showSearch(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/') + item.id]))
      .avatarUrlResolver((item) => 'https://semantic-ui.com/images/avatar/large/elliot.jpg')
      .build();
  }
}