import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentDependencyService } from '../../../core';
import { BaseClientsPageComponent } from '../base-clients-page.component';
import { ClientMenuItems } from '../menu.items';

@Component({
    templateUrl: 'user-gallery-page.component.html'
})
export class UserGalleryPageComponent extends BaseClientsPageComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();
        super.subscribeToObservable(this.clientChange.map(client => {
            this.setConfig({
                menuItems: new ClientMenuItems(client.id).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                componentTitle: {
                    'key': 'module.clients.submenu.gallery'
                },
                menuAvatarUrl: client.getAvatarOrGravatarUrl()
            });
        }));
    }
}

