import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentDependencyService } from '../../../core';
import { BaseClientsPageComponent } from '../base-clients-page.component';
import { ClientMenuItems } from '../menu.items';
import { Subject } from 'rxjs/Rx';
import { User } from 'app/models';

@Component({
  templateUrl: 'client-dashboard-page.component.html'
})
export class ClientDashboardPageComponent extends BaseClientsPageComponent implements OnInit {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.init();
  }

  private init(): void {
    super.subscribeToObservable(this.clientChange.map(client => {

      this.setConfig({
        menuItems: new ClientMenuItems(client.id).menuItems,
        menuTitle: {
          key: 'module.clients.viewClientSubtitle',
          data: { 'fullName': client.getFullName() }
        },
        componentTitle: {
          'key': 'module.clients.submenu.dashboard'
        },
        menuAvatarUrl: client.getAvatarOrGravatarUrl()
      });
    })
    );
  }
}
