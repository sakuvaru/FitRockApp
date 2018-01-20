import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { DataTableComponent, DataTableConfig, DataTableMode } from '../../../../../web-components/data-table';
import { AppConfig } from '../../../../config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../../core';

@Component({
  selector: 'mod-clients-overview',
  templateUrl: 'clients-overview.component.html'
})
export class ClientsOverviewComponent extends BaseModuleComponent implements OnInit, OnChanges {

  @Input() mode: DataTableMode;

  @Output() modeChanged = new EventEmitter<DataTableMode>();

  @ViewChild('clientsDataTable') clientsDataTable: DataTableComponent;

  public config: DataTableConfig;

  private readonly rememberDataTableStateName: string = 'clients_overview_data_table_mode';

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode) {
      if (this.config.mode !== this.mode) {
        this.toggleMode();
      }
    }
  }

  toggleMode(): void {
    this.clientsDataTable.toggleMode();

    this.modeChanged.next(this.config.mode);

    if (this.clientsDataTable.config.mode === DataTableMode.Standard) {
      // remember last active mode

      this.dependencies.coreServices.rememberService.set(this.rememberDataTableStateName, 'standard');
    } else {
      // remember last active mode
      this.dependencies.coreServices.rememberService.set(this.rememberDataTableStateName, 'other');
    }
  }

  private init(): void {
    this.config = this.dependencies.itemServices.userService.buildDataTable(
      (query, search) => {
        return this.dependencies.itemServices.userService.clients()
          .whereLikeMultiple(['FirstName', 'LastName'], search);
      }
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
          query: query => query
            .whereEquals('IsActive', true)
            .whereEquals('TrainerUserId', this.authUser ? this.authUser.id : 0),
          priority: 1
        },
        {
          name: super.translate('module.clients.inactiveClients'),
          guid: 'InactiveClients',
          query: query => query
            .whereEquals('IsActive', false)
            .whereEquals('TrainerUserId', this.authUser ? this.authUser.id : 0),
          priority: 2
        },
      ]
      )
      .groupByItemsCount(6)
      .pageSize(12)
      .mode(
      this.dependencies.coreServices.rememberService.get<string>(this.rememberDataTableStateName, 'tiles') === 'standard' ? DataTableMode.Standard : DataTableMode.Tiles
      )
      .allFilter(undefined, (search) => this.dependencies.itemServices.userService.count()
        .whereLikeMultiple(['FirstName', 'LastName'], search)
        .whereEquals('TrainerUserId', this.authUser ? this.authUser.id : 0))
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/' + item.id + '/dashboard')]))
      .avatarImage((item) => {
        const avatarOrGravatar = item.getAvatarOrGravatarUrl();
        if (avatarOrGravatar) {
          return avatarOrGravatar;
        }
        return AppConfig.DefaultUserAvatarUrl;
      })
      .build();

    this.modeChanged.next(this.config.mode);
  }
}
