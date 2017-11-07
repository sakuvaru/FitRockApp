// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// required by component
import { ProgressItemType } from '../../../models';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Rx';

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

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
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
                    menuAvatarUrl: client.avatarUrl,
                });
            });
    }
}

