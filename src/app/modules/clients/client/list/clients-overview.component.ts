// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientOverviewMenuItems } from '../../menu.items';
import { DataTableConfig } from '../../../../../web-components/data-table';

@Component({
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends ClientsBaseComponent implements OnInit {

  public config: DataTableConfig;

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
    this.init();
    super.initClientSubscriptions();
  }

  private init(): void {
    this.setConfig({
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' },
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
          sortKey: 'FirstName'
        },
        { 
          value: (item) => item.email,
          name: (item) => super.translate('module.clients.email'),
          sortKey: 'Email'
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
      .allFilter()
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/' + item.id + '/dashboard')]))
      .avatarImage((item) => item.avatarUrl ? item.avatarUrl : AppConfig.DefaultUserAvatarUrl)
      .build();
  }
}
