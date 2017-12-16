import { Injectable } from '@angular/core';
import { Appointment } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

import { CalendarBuilder } from '../../../web-components/calendar';
import { CalendarService } from 'app/web-component-services';
import { ComponentDependencyService } from 'app/core';
import { AppConfig } from 'app/config';
import { CalendarEventModel } from 'web-components/calendar/calendar.models';
import { LocalizationService } from 'lib/localization';
import { TimeService } from 'app/core/services/time.service';
import { UserService } from 'app/services';

@Injectable()
export class AppointmentService extends BaseTypeService<Appointment> {

    private calendarService: CalendarService = new CalendarService();

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'Appointment',
            allowDelete: true
        });
    }

    buildCalendar(
        dependencies: {
            localizationService: LocalizationService,
            timeService: TimeService,
            userService: UserService
        },
        trainerUserId: number,
        locale: string,
        options: {
            onEventClick: (event: CalendarEventModel<Appointment>) => void
        }): CalendarBuilder {
        return this.calendarService.calendar(
            locale,
            (date) => this.items()
                // take only only current month + 1 month and - 1 month
                .whereGreaterThan('AppointmentDate', dependencies.timeService.moment(date).add(-1, 'months').toDate())
                .whereLessThen('AppointmentDate', dependencies.timeService.moment(date).add(1, 'months').toDate())
            ,
            (event) => this.delete(event.model.id),
            (event) => this.buildEditForm(
                this.editFormQuery(event.model.id).withData('clientId', event.model.clientId)
            ),
            (attendee) => this.buildInsertForm({
                formDefinitionQuery: this.insertFormQuery().withData('clientId', attendee.model.id)
            }),
            (dependencies.userService.buildDataTable(
                (query, search) => query.whereEquals('TrainerUserId', trainerUserId).whereLikeMultiple(['FirstName', 'LastName'], search)
            )
                .avatarImage((item) => item.avatarUrl ? item.avatarUrl : AppConfig.DefaultUserAvatarUrl)
                .withFields([
                    {
                        hideOnSmallScreen: false,
                        name: (item) => dependencies.localizationService.get('Fullname (translate todo)'),
                        value: (item) => item.getFullName(),
                        sortKey: 'FirstName'
                    },
                    {
                        hideOnSmallScreen: true,
                        name: (item) => dependencies.localizationService.get('E-mail (translate todo)'),
                        value: (item) => item.email,
                        sortKey: 'Email'
                    },
                ])
            )
        )
            .onEventClick(options.onEventClick);
    }
}
