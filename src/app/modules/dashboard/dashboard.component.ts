// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';

// required by component
import { Log, User, Exercise } from '../../models';
import { CurrentUser } from '../../../lib/auth';
import { Observable } from 'rxjs/Rx';
import { CalendarComponent } from '../../../web-components/calendar/';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    public logs: Log[];
    public log: Log;
    public currentUser: CurrentUser | null;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.setConfig({
            menuTitle: { key: 'menu.main' },
            componentTitle: { key: 'menu.dashboard' }
        });

        this.dependencies.itemServices.userService.item().byId(1).get().subscribe(response => console.log(response));

        super.subscribeToObservable(this.dependencies.itemServices.logService.items().limit(5).orderByDesc('id').get()
            .takeUntil(this.ngUnsubscribe)
            .map(
            response => {
                console.log(response);
                this.logs = response.items;
            }));

        this.currentUser = this.dependencies.coreServices.authService.getCurrentUser();
    }

    onLogout(): void {
        this.dependencies.coreServices.authService.logout();
    }
}
