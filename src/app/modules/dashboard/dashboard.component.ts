import { Component, OnInit } from '@angular/core';
import { LanguageEnum } from 'lib/repository';

import { Auth0User } from '../../../lib/auth';
import { CalendarConfig } from '../../../web-components/calendar/calendar.config';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { Log } from '../../models';

@Component({
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent extends BasePageComponent implements OnInit {

    public logs: Log[];
    public log: Log;
    public currentUser: Auth0User | null;

    public calendarConfig: CalendarConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.calendarConfig = this.dependencies.itemServices.appointmentService.buildCalendar(
            {
                localizationService: this.dependencies.coreServices.localizationService,
                timeService: this.dependencies.coreServices.timeService,
                userService: this.dependencies.itemServices.userService
            },
            this.authUser ? this.authUser.id : 0,
            this.currentLanguage ? this.currentLanguage.locale : '',
            {
                onEventClick: event => this.dependencies.coreServices.navigateService.navigate([this.getTrainerUrl(`/clients/edit/${event.model.clientId}/appointments/view/${event.model.id}`)]),
                onError: error => super.handleAppError(error)
            }
        )
            .build();

        this.setConfig({
            menuTitle: { key: 'menu.main' },
            componentTitle: { key: 'menu.dashboard' }
        });

        this.dependencies.itemServices.userService.item().byId(this.authUser ? this.authUser.id : 0).get().subscribe(response => {
        } );

        this.dependencies.itemServices.userService.items().byCurrentUser().toCountQuery().get().subscribe(response => console.log(response));

        super.subscribeToObservable(this.dependencies.itemServices.logService.items().limit(5).orderByDesc('id').get()
            .takeUntil(this.ngUnsubscribe)
            .map(
            response => {
                console.log(response);
                this.logs = response.items;
            }));

        this.currentUser = this.dependencies.coreServices.authService.getCurrentAuthUser();
    }

    onLogout(): void {
        this.dependencies.coreServices.authService.logout();
    }
}
