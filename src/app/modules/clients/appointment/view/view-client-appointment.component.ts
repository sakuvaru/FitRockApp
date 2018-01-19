import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppConfig } from '../../../../config';
import { ComponentDependencyService } from '../../../../core';
import { Appointment } from '../../../../models';
import { BaseClientModuleComponent } from '../../../clients/base-client-module.component';

@Component({
  selector: 'mod-view-client-appointment',
  templateUrl: 'view-client-appointment.component.html'
})
export class ViewClientAppointmentComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

  @Input() appointmentId: number;

  @Output() loadAppointment = new EventEmitter<Appointment>();

  public appointment?: Appointment;
  public googleApiKey: string = AppConfig.GoogleApiKey;

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.client && this.appointmentId) {
      super.subscribeToObservable(this.getInitObservable());
    }
  }

  private getInitObservable(): Observable<void> {
    return this.dependencies.itemServices.appointmentService.item().byId(this.appointmentId)
      .includeMultiple(['Location', 'Workout'])
      .get()
      .map(response => {
        // check if appointment is assigned to current client
        if (response.item.clientId !== this.client.id) {
          this.dependencies.coreServices.navigateService.item404().navigate();
        }

        this.appointment = response.item;
        this.loadAppointment.next(response.item);
      });
  }
}
