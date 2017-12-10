import { Component, OnInit } from '@angular/core';

import { CurrentUser } from '../../../lib/auth';
import { CalendarConfig } from '../../../web-components/calendar/calendar.config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { Log } from '../../models';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {

    public logs: Log[];
    public log: Log;
    public currentUser: CurrentUser | null;

    public calendarConfig: CalendarConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.calendarConfig = this.dependencies.webComponentServices.calendarService.calendar(
            this.currentLanguage ? this.currentLanguage.locale : '',
            (date) => this.dependencies.itemServices.appointmentService.items()
                // take only only current month + 1 month and - 1 month
                .whereGreaterThan('AppointmentDate', this.dependencies.coreServices.timeService.moment(date).add(-1, 'months').toDate())
                .whereLessThen('AppointmentDate', this.dependencies.coreServices.timeService.moment(date).add(1, 'months').toDate())
            ,
            (event) => this.dependencies.itemServices.appointmentService.delete(event.model.id))
            .onEventEditClick(event => this.dependencies.router.navigate([this.getTrainerUrl(`/clients/edit/${event.model.clientId}/appointments/edit/${event.model.id}`)]))
            .onEventClick(event => this.dependencies.router.navigate([this.getTrainerUrl(`/clients/edit/${event.model.clientId}/appointments/view/${event.model.id}`)]))
            .build();

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
