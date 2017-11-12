// common
import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { DataListConfig, AlignEnum, Filter } from '../../../../../web-components/data-list';
import { Appointment } from '../../../../models';
import { MultipleItemQuery } from '../../../../../lib/repository';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'client-appointment-list.component.html'
})
export class ClientAppointmentListComponent extends ClientsBaseComponent implements OnInit {

  private config: DataListConfig<Appointment>;

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
        menuAvatarUrl: client.avatarUrl
      });

      this.initList(client.id);
    });
  }

  private initList(clientId: number): void {

    const dateNow = new Date();
    dateNow.setSeconds(0);
    dateNow.setMilliseconds(0);

    this.config = this.dependencies.webComponentServices.dataListService.dataList<Appointment>(
      searchTerm => {
        return this.dependencies.itemServices.appointmentService.items()
          .byCurrentUser()
          .whereEquals('ClientId', clientId)
          .include('Location');
      },
    )
      .withFields([
        {
          value: (item) => item.appointmentName,
          flex: 50
        },
        {
          value: (item) => item.location.locationName,
          flex: 25,
          isSubtle: true,
          hideOnSmallScreens: true,
          align: AlignEnum.Right
        },
        {
          value: (item) => super.formatDate(item.appointmentDate),
          isSubtle: true,
          align: AlignEnum.Right,
        },
      ])
      .showAllFilter(false)
      .showSearch(false)
      .filter(new Filter({
        filterNameKey: 'module.clients.appointments.upcomingAppointments',
        onFilter: query => query.whereGreaterThan('AppointmentDate', dateNow),
        countQuery: (query) => query.toCountQuery()
      }))
      .filter(new Filter({
        filterNameKey: 'module.clients.appointments.oldAppointments',
        onFilter: query => query.whereLessThen('AppointmentDate', dateNow),
        countQuery: (query) => query.toCountQuery()
      }))
      .showPager(true)
      .pagerSize(7)
      .onClick((item) => super.navigate([super.getTrainerUrl('clients/edit/') + this.clientId + '/appointments/view/' + item.id]))
      .build();
  }
}
