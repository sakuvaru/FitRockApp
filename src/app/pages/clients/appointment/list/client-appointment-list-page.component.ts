import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableConfig } from '../../../../../web-components/data-table';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { ClientMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'client-appointment-list-page.component.html'
})
export class ClientAppointmentListPageComponent extends BaseClientsPageComponent implements OnInit {

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservable(
      this.clientChange.map(client => {
        this.setConfig({
          menuItems: new ClientMenuItems(client.id).menuItems,
          menuTitle: {
            key: 'module.clients.viewClientSubtitle',
            data: { 'fullName': client.getFullName() }
          },
          componentTitle: {
            'key': 'module.clients.submenu.appointments'
          },
          menuAvatarUrl: client.getAvatarOrGravatarUrl()
        });
      })
    );
  }
}
