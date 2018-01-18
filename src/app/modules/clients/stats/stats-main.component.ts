import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { ComponentDependencyService, ComponentSetup } from '../../../core';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';

@Component({
    selector: 'stats-main',
    templateUrl: 'stats-main.component.html'
})
export class StatsMainComponent extends ClientsBaseComponent implements OnInit {

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
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

        super.subscribeToObservable(this.getClientMenuObservable());
        super.initClientSubscriptions();
    }

    private getClientMenuObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.stats'
                    },
                    menuAvatarUrl: client.getAvatarOrGravatarUrl(),
                });
            });
    }
}

