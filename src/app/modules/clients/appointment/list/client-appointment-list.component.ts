// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { DataTableConfig } from '../../../../../web-components/data-table';
import { Appointment } from '../../../../models';
import { MultipleItemQuery } from '../../../../../lib/repository';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'client-appointment-list.component.html'
})
export class ClientAppointmentListComponent extends ClientsBaseComponent implements OnInit {

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
    super.subscribeToObservable(this.getInitObservable());
    super.initClientSubscriptions();
  }

  private getInitObservable(): Observable<any> {
    return this.clientChange.map(client => {

      // component config
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

      this.initList(client.id);
    });
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
        },
        {
          name: super.translate('module.clients.appointments.oldAppointments'),
          guid: 'oldAppointments',
          query: query => query.whereLessThen('AppointmentDate', dateNow),
        }
      ])
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/') + this.clientId + '/appointments/view/' + item.id]))
      .build();
  }
}
