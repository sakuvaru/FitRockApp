import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentDependencyService } from '../../../../core';
import { BaseClientsPageComponent } from '../../base-clients-page.component';
import { NewClientMenuItems } from '../../menu.items';

@Component({
    templateUrl: 'new-client-page.component.html'
})
export class NewClientPageComponent extends BaseClientsPageComponent implements OnInit {

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.setConfig({
            componentTitle: { key: 'module.clients.submenu.newClient' },
            menuItems: new NewClientMenuItems().menuItems
        });
    }
}
