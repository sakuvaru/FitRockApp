import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Appointment } from 'app/models';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
  selector: 'mod-edit-client-appointment',
  templateUrl: 'edit-client-appointment.component.html'
})
export class EditClientAppointmentComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

  @Input() appointmentId: number;

  @Output() loadAppointment = new EventEmitter<Appointment>();

  public formConfig: DataFormConfig;

  constructor(
    protected componentDependencyService: ComponentDependencyService,
  ) {
    super(componentDependencyService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.appointmentId && this.client) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.formConfig = this.dependencies.itemServices.appointmentService.buildEditForm(
        this.dependencies.itemServices.appointmentService.editFormQuery(this.appointmentId).withData('clientId', this.client.id)
    )
      .enableDelete(true)
      .onAfterDelete(() => super.navigate([this.getTrainerUrl('clients/edit/' + this.client.id + '/appointments')]))
      .onEditFormLoaded(form => {
        const appointment = form.item;

         this.loadAppointment.next(appointment);

      })
      .build();
  }
}
