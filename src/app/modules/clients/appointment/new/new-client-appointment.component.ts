import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { User } from 'app/models';
import { BaseClientModuleComponent } from 'app/modules/clients/base-client-module.component';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';

@Component({
    selector: 'mod-new-client-appointment',
    templateUrl: 'new-client-appointment.component.html'
})
export class NewClientAppointmentComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.initForm(this.client);
        }
    }

    private initForm(client: User): void {
        this.formConfig = this.dependencies.itemServices.appointmentService.buildInsertForm({
            formDefinitionQuery: this.dependencies.itemServices.appointmentService.insertFormQuery().withData('clientId', client.id)
        })
            .configField((field, item) => {
                if (field.key === 'ClientId') {
                    field.value = client.id;
                }
                return Observable.of(field);
            })
            .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + client.id + '/appointments/edit/' + response.item.id)]))
            .build();
    }
}
