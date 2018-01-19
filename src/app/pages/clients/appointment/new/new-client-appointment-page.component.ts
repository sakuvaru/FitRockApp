import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { NewClientAppointmentMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'new-client-appointment-page.component.html'
})
export class NewClientAppointmentPageComponent extends BaseClientsPageComponent implements OnInit {

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservable(
            this.clientChange.map(client => {
                this.setConfig({
                    componentTitle: { key: 'module.clients.appointments.newAppointment' },
                    menuItems: new NewClientAppointmentMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    menuAvatarUrl: client.getAvatarOrGravatarUrl()
                });
            })
        );
    }
}
