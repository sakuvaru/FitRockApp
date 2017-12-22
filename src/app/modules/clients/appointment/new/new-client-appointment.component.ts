// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { DataFormConfig } from '../../../../../web-components/data-form';
import { NewClientAppointmentMenuItems } from '../../menu.items';
import { Appointment } from '../../../../models';
import { Observable } from 'rxjs/Rx';

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
                },
                menuAvatarUrl: this.client.getAvatarOrGravatarUrl()
            });
        });
    }

    private getFormObservable(): Observable<any> {
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

            },
            error => super.handleAppError(error));
    }
}
