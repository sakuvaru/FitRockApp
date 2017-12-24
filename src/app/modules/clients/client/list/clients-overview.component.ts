import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableMode, DataTableConfig, DataTableComponent } from '../../../../../web-components/data-table';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientOverviewMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends ClientsBaseComponent implements OnInit {

  public config: DataTableConfig;

  @ViewChild('clientsDataTable') clientsDataTable: DataTableComponent;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: true,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.init();
    super.initClientSubscriptions();
  }

  changeMode(): void {
    if (this.config.mode === DataTableMode.Standard) {
      this.config.mode = DataTableMode.Tiles;
    } else {
      this.config.mode = DataTableMode.Standard;
    }
  }

  private init(): void {
    this.setConfig({
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' }
    });

    this.config = this.dependencies.itemServices.userService.buildDataTable(
      (query, search) => {
        return this.dependencies.itemServices.userService.clients()
          .whereLikeMultiple(['FirstName', 'LastName'], search);
      },
    )
      .withFields([
        {
          value: (item) => item.getFullName(),
          name: (item) => super.translate('module.clients.fullName'),
          sortKey: 'FirstName',
          hideOnSmallScreen: false
        },
        {
          value: (item) => item.email,
          name: (item) => super.translate('module.clients.email'),
          sortKey: 'Email',
          hideOnSmallScreen: true
        }
      ])
      .withFilters(
      [
        {
          name: super.translate('module.clients.activeClients'),
          guid: 'ActiveClients',
          query: query => query.whereEquals('IsActive', true),
        },
        {
          name: super.translate('module.clients.inactiveClients'),
          guid: 'InactiveClients',
          query: query => query.whereEquals('IsActive', false),
        }
      ]
      )
      .groupByItemsCount(5)
      .mode(DataTableMode.Tiles)
      .allFilter()
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/' + item.id + '/dashboard')]))
      .avatarImage((item) => {
        const avatarOrGravatar = item.getAvatarOrGravatarUrl();
        if (avatarOrGravatar) {
          return avatarOrGravatar;
        }
        return AppConfig.DefaultUserAvatarUrl;
      })
      .build();

      // configure component actions after config is set up
      super.setConfig({
        actions: [{
          action: () => this.clientsDataTable.toggleMode(),
          icon: () => this.config.mode === DataTableMode.Standard ? 'view_module' : 'view_headline',
          tooltip: () => this.config.mode === DataTableMode.Standard ? super.translate('shared.tiles') : super.translate('shared.list')
        }]
      });
  }
}
