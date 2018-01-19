import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { NewClientDietMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'new-client-diet-page.component.html'
})
export class NewClientDietPageComponent extends BaseClientsPageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.subscribeToObservable(
            this.clientChange.map(client => {
                this.setConfig({
                    componentTitle: { key: 'module.clients.diet.newDiet' },
                    menuItems: new NewClientDietMenuItems(client.id).menuItems,
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
