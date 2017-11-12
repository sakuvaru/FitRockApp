// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { NewClientAppointmentMenuItems } from '../../menu.items';
import { Appointment } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-client-appointment.component.html'
})
export class NewClientAppointmentComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<Appointment>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: true });
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getObservables());
        super.initClientSubscriptions();
    }

    private getObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];
        observables.push(this.getClientObservable());
        observables.push(this.getFormObservable());
        return observables;
    }

    private getClientObservable(): Observable<any> {
        return this.clientChange.map(client => {
            this.setConfig({
                componentTitle: { key: 'module.clients.appointments.newAppointment' },
                menuItems: new NewClientAppointmentMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                }
            });
        });
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .map(clientId => {
                this.formConfig = this.dependencies.itemServices.appointmentService.insertForm({
                    customFormDefinitionQuery: this.dependencies.itemServices.appointmentService.insertFormQuery().withData('clientId', clientId)
                })
                    .fieldValueResolver((fieldName, value) => {
                        if (fieldName === 'ClientId') {
                            return clientId;
                        }
                        return value;
                    })
                    .onAfterInsert((response) => super.navigate([super.getTrainerUrl('clients/edit/' + clientId + '/appointments/edit/' + response.item.id)]))
                    .build();

            },
            error => super.handleError(error));
    }
}
