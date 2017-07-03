// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { ClientOverviewMenuItems } from '../../menu.items';
import { DataTableConfig, AlignEnum } from '../../../../../web-components/data-table';
import { User } from '../../../../models';

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
    this.setConfig({
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' },
    });

    this.config = this.dependencies.webComponentServices.dataTableService.dataTable<User>()
      .fields([
        { label: 'Klient', value: (item) => { return item.getFullName() }, flex: 40 },
        { label: 'E-mail', value: (item) => { return item.email }, isSubtle: true, align: AlignEnum.Right },
      ])
      .loadResolver((searchTerm, page, pageSize) => {
        return this.dependencies.itemServices.userService.clients()
          .pageSize(pageSize)
          .page(page)
          .WhereLikeMultiple(["FirstName", "LastName"], searchTerm)
          .get()
          .takeUntil(this.ngUnsubscribe)
      })
      .onBeforeLoad(() => this.startLoader())
      .onAfterLoad(() => {

        this.stopLoader();
      })
      .showPager(true)
      .showSearch(true)
      .showHeader(false)
      .pagerSize(7)
      .onClick((item) => this.navigate([this.getTrainerUrl('clients/edit/') + item.id]))
      .avatarUrlResolver((item) => 'https://semantic-ui.com/images/avatar/large/elliot.jpg')
      .build();
  }
}