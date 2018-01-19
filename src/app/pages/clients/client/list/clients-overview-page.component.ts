import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx';
import { DataTableMode } from 'web-components/data-table';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { ClientOverviewMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'clients-overview-page.component.html'
})
export class ClientsOverviewPageComponent extends BaseClientsPageComponent implements OnInit {

  public toggleMode = new Subject<void>();
  public activeMode?: DataTableMode;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute, {
      menuTitle: { key: 'menu.clients' },
      menuItems: new ClientOverviewMenuItems().menuItems,
      componentTitle: { key: 'module.clients.allClients' },
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.setConfig({
      actions: [{
        action: () => this.toggleMode.next(),
        icon: () => this.activeMode === DataTableMode.Standard ? 'view_module' : 'view_headline',
        tooltip: () => this.activeMode === DataTableMode.Standard ? super.translate('shared.tiles') : super.translate('shared.list')
      }]
    });
  }

  modeActivated(mode: DataTableMode): void {
    this.activeMode = mode;
  }
}
