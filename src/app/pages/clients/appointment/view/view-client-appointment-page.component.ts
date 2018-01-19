import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { ClientEditAppointmentMenuItems } from '../../menu.items';
import { Appointment } from 'app/models';

@Component({
  templateUrl: 'view-client-appointment-page.component.html'
})
export class ViewClientAppointmentPageComponent extends BaseClientsPageComponent implements OnInit {

  public appointmentId?: number;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservable(
      this.activatedRoute.params
        .map(params => {
          this.appointmentId = +params['appointmentId'];
        }));
  }

  loadAppointment(appointment: Appointment): void {
    this.setConfig({
      menuItems: new ClientEditAppointmentMenuItems(this.client.id, appointment.id).menuItems,
      menuTitle: {
        key: 'module.clients.viewClientSubtitle',
        data: { 'fullName': this.client.getFullName() }
      },
      componentTitle: {
        'key': 'module.clients.appointments.viewAppointmentWithName', data: { 'appointmentName': appointment.appointmentName }
      },
      menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
    });
  }
}
