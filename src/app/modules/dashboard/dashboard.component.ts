import { AppConfig } from '../../config';
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

        this.calendarConfig = this.dependencies.itemServices.appointmentService.buildCalendar(
            {
                localizationService: this.dependencies.coreServices.localizationService,
                timeService: this.dependencies.coreServices.timeService,
                userService: this.dependencies.itemServices.userService
            },
            this.authUser ? this.authUser.id : 0,
            this.currentLanguage ? this.currentLanguage.locale : '',
            {
                onEventClick: event => this.dependencies.router.navigate([this.getTrainerUrl(`/clients/edit/${event.model.clientId}/appointments/view/${event.model.id}`)])
            }
        )
            .build();

        /*
        this.calendarConfig = this.dependencies.webComponentServices.calendarService.calendar(
            this.currentLanguage ? this.currentLanguage.locale : '',
            (date) => this.dependencies.itemServices.appointmentService.items()
                // take only only current month + 1 month and - 1 month
                .whereGreaterThan('AppointmentDate', this.dependencies.coreServices.timeService.moment(date).add(-1, 'months').toDate())
                .whereLessThen('AppointmentDate', this.dependencies.coreServices.timeService.moment(date).add(1, 'months').toDate())
            ,
            (event) => this.dependencies.itemServices.appointmentService.delete(event.model.id),
            (event) => this.dependencies.itemServices.appointmentService.buildEditForm(
                this.dependencies.itemServices.appointmentService.editFormQuery(event.model.id).withData('clientId', event.model.clientId)
            ),
            (attendee) => this.dependencies.itemServices.appointmentService.buildInsertForm({
                formDefinitionQuery: this.dependencies.itemServices.appointmentService.insertFormQuery().withData('clientId', attendee.model.id)
            }),
            (this.dependencies.itemServices.userService.buildDataTable(
                (query, search) => query.whereLikeMultiple(['FirstName', 'LastName'], search)
            )
                .avatarImage((item) => item.avatarUrl ? item.avatarUrl : AppConfig.DefaultUserAvatarUrl)
                .withFields([
                    {
                        hideOnSmallScreen: false,
                        name: (item) => super.translate('Fullname (translate todo)'),
                        value: (item) => item.getFullName(),
                        sortKey: 'FirstName'
                    },
                    {
                        hideOnSmallScreen: true,
                        name: (item) => super.translate('E-mail (translate todo)'),
                        value: (item) => item.email,
                        sortKey: 'Email'
                    },
                ])
            )
        )
            .onEventClick(event => this.dependencies.router.navigate([this.getTrainerUrl(`/clients/edit/${event.model.clientId}/appointments/view/${event.model.id}`)]))
            .build();

            */

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
