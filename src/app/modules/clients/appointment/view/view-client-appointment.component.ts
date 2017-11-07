// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditAppointmentMenuItems } from '../../menu.items';
import { FormConfig, DynamicFormComponent } from '../../../../../web-components/dynamic-form';
import { Appointment, User } from '../../../../models';

@Component({
  templateUrl: 'view-client-appointment.component.html'
})
export class ViewClientAppointmentComponent extends ClientsBaseComponent implements OnInit {

  private appointment?: Appointment;
  private googleApiKey: string = AppConfig.GoogleApiKey;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup | null {
    return {
      initialized: false
    };
  }

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservable(this.getInitObservable());
    super.initClientSubscriptions();
  }

  private getInitObservable(): Observable<any> {
    return this.clientChange
      .switchMap(client => this.activatedRoute.params
        .switchMap(params => {
          const appointmentId = +params['appointmentId'];

          return this.dependencies.itemServices.appointmentService.item().byId(appointmentId)
            .includeMultiple(['Location', 'Workout'])
            .get();
        })
        .map(response => {
          // check if appointment is assigned to current client
          if (response.item.clientId !== this.clientId) {
            super.navigateTo404();
          }

          this.appointment = response.item;

          this.setConfig({
            menuItems: new ClientEditAppointmentMenuItems(this.client.id, this.appointment.id).menuItems,
            menuTitle: {
              key: 'module.clients.viewClientSubtitle',
              data: { 'fullName': this.client.getFullName() }
            },
            componentTitle: {
              'key': 'module.clients.appointments.viewAppointmentWithName', data: { 'appointmentName': this.appointment.appointmentName }
            },
            menuAvatarUrl: this.client.avatarUrl
          });
        })
      );
  }
}
