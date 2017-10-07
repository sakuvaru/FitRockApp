// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientOverviewMenuItems } from '../../menu.items';
import { DataTableConfig, AlignEnum, Filter } from '../../../../../web-components/data-table';
import { User, UserFilterWithCount } from '../../../../models';
import { MultipleItemQuery } from '../../../../../lib/repository';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends ClientsBaseComponent implements OnInit {

  private config: DataTableConfig<User>;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute)
  }

  setup(): ComponentSetup | null {
    return {
        initialized: true
    }
}

  ngOnInit(): void {
    super.ngOnInit();
    this.initDataTable();
    super.initClientSubscriptions();
  }

  private initDataTable(): void {
    this.setConfig({
      autoInitComponent: true,
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
          .whereLikeMultiple(["FirstName", "LastName"], searchTerm)
      })
      .loadResolver(query => {
        return query
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
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
      .avatarUrlResolver((item) => {
        if (item.avatarUrl) {
          return item.avatarUrl;
        }
        return this.defaultImageSrc;
      })
      .build();
  }
}