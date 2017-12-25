// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditAppointmentMenuItems } from '../../menu.items';
import { DataFormConfig, DataFormComponent} from '../../../../../web-components/data-form';
import { Appointment } from '../../../../models';

@Component({
  templateUrl: 'edit-client-appointment.component.html'
})
export class EditClientAppointmentComponent extends ClientsBaseComponent implements OnInit {

  public formConfig: DataFormConfig;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService, activatedRoute);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
        initialized: true,
        isNested: false
    });
}

  ngOnInit(): void {
    super.ngOnInit();

    super.subscribeToObservable(this.getInitObservable());
    super.initClientSubscriptions();
  }

  private getInitObservable(): Observable<any> {
    return this.clientChange
      .switchMap(client => {
        return this.activatedRoute.params
          .map(params => {
            return +params['appointmentId'];
          });
      })
      .map(appointmentId => {
        this.initForm(appointmentId);
      });
  }

  private initForm(appointmentId: number): void {
    this.formConfig = this.dependencies.itemServices.appointmentService.buildEditForm(
        this.dependencies.itemServices.appointmentService.editFormQuery(appointmentId).withData('clientId', this.clientId)
    )
      .enableDelete(true)
      .onAfterDelete(() => super.navigate([this.getTrainerUrl('clients/edit/' + this.clientId + '/appointments')]))
      .onEditFormLoaded(form => {
        const appointment = form.item;

         // setup menu
         this.setConfig({
          menuItems: new ClientEditAppointmentMenuItems(this.client.id, appointmentId).menuItems,
          menuTitle: {
            key: 'module.clients.viewClientSubtitle',
            data: { 'fullName': this.client.getFullName() }
          },
          componentTitle: {
            'key': 'module.clients.appointments.editAppointmentWithName', data: { 'appointmentName': appointment.appointmentName }
          },
          menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
        });

      })
      .build();
  }
}
