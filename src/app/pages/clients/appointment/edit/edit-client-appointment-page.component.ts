import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Rx';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { User, Appointment } from 'app/models';
import { ClientEditAppointmentMenuItems } from '../../menu.items';

@Component({
  templateUrl: 'edit-client-appointment-page.component.html'
})
export class EditClientAppointmentPageComponent extends BaseClientsPageComponent implements OnInit {

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
      this.clientChange.switchMap(client =>
        this.activatedRoute.params.map(params => {
          this.appointmentId = +params['appointmentId'];
        })));
  }

  private loadAppointment(appointment: Appointment): void {
    // setup menu
    this.setConfig({
      menuItems: new ClientEditAppointmentMenuItems(this.client.id, appointment.id).menuItems,
      menuTitle: {
        key: 'module.clients.viewClientSubtitle',
        data: { 'fullName': this.client.getFullName() }
      },
      componentTitle: {
        'key': 'module.clients.appointments.editAppointmentWithName', data: { 'appointmentName': appointment.appointmentName }
      },
      menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
    });
  }
}
