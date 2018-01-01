import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ClientsBaseComponent } from '../../clients-base.component';
import { NewClientAppointmentMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'new-client-appointment.component.html'
})
export class NewClientAppointmentComponent extends ClientsBaseComponent implements OnInit {

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

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getObservables());
        super.initClientSubscriptions();
    }

    private getObservables(): Observable<void>[] {
        const observables: Observable<void>[] = [];
        observables.push(this.getClientObservable());
        observables.push(this.getFormObservable());
        return observables;
    }

    private getClientObservable(): Observable<void> {
        return this.clientChange.map(client => {
            this.setConfig({
                componentTitle: { key: 'module.clients.appointments.newAppointment' },
                menuItems: new NewClientAppointmentMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                menuAvatarUrl: client.getAvatarOrGravatarUrl()
            });
        });
    }

    private getFormObservable(): Observable<void> {
        return this.clientIdChange
            .map(clientId => {
                this.formConfig = this.dependencies.itemServices.appointmentService.buildInsertForm({
                    formDefinitionQuery: this.dependencies.itemServices.appointmentService.insertFormQuery().withData('clientId', clientId)
                })
                    .fieldValueResolver((fieldName, value) => {
                        if (fieldName === 'ClientId') {
                            return Observable.of(clientId);
                        }
                        return Observable.of(value);
                    })
                    .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + clientId + '/appointments/edit/' + response.item.id)]))
                    .build();
            });
    }
}
