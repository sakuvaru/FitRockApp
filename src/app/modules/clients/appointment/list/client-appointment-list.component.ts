import { Component, OnChanges, OnInit } from '@angular/core';

import { DataTableConfig } from '../../../../../web-components/data-table';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../../clients/base-client-module.component';

@Component({
  selector: 'mod-client-appointment-list',
  templateUrl: 'client-appointment-list.component.html'
})
export class ClientAppointmentListComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

  public config: DataTableConfig;

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(): void {
    if (this.client) {
      this.initList(this.client.id);
    }
  }

  private initList(clientId: number): void {

    const dateNow = new Date();
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);

    this.config = this.dependencies.itemServices.appointmentService.buildDataTable((query, search) => query
      .byCurrentUser()
      .whereEquals('ClientId', clientId)
      .whereLike('AppointmentName', search)
      .include('Location'))
      .withFields([
        {
          value: (item) => item.appointmentName,
          name: (item) => super.translate('module.clients.appointments.appointmentName'),
          sortKey: 'AppointmentName',
          hideOnSmallScreen: false
        },
        {
          value: (item) => item.location.locationName,
          name: (item) => super.translate('module.clients.appointments.where'),
          sortKey: 'Location.LocationName',
          hideOnSmallScreen: true
        },
        {
          value: (item) => super.formatDate(item.appointmentDate),
          name: (item) => super.translate('module.clients.appointments.when'),
          sortKey: 'AppointmentDate',
          hideOnSmallScreen: true
        },
      ])
      .withFilters([
        {
          name: super.translate('module.clients.appointments.upcomingAppointments'),
          guid: 'upcomingAppointments',
          query: query => query.whereGreaterThan('AppointmentDate', dateNow),
          priority: 1
        },
        {
          name: super.translate('module.clients.appointments.oldAppointments'),
          guid: 'oldAppointments',
          query: query => query.whereLessThen('AppointmentDate', dateNow),
          priority: 2
        }
      ])
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/') + this.client.id + '/appointments/view/' + item.id]))
      .build();
  }
}
