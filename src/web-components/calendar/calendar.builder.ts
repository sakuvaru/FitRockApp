import { CalendarColor } from './calendar.enums';
import { Observable } from 'rxjs/Rx';

import { CalendarConfig } from './calendar.config';
import { CalendarEventModel, CalendarDeleteResponse } from './calendar.models';
import { Appointment, User } from '../../app/models';
import {
    DeleteItemQuery,
    MultipleItemQuery,
    ResponseCreate,
    ResponseEdit,
    ResponseFormEdit,
    ResponseFormInsert,
} from '../../lib/repository';
import { DataFormEditResponse, DataFormInsertResponse, dataFormBuilderUtils, DataFormEditDefinition, DataFormInsertDefinition, DataFormBuilder } from 'web-components/data-form';
import { DataTableBuilder } from 'web-components/data-table';
import { CalendarEventAttendee } from 'web-components/calendar';

export class CalendarBuilder {

    private readonly config: CalendarConfig = new CalendarConfig();

    private readonly type: string = 'appointment';

    constructor(
        private locale: string,
        private fetchQuery: (date: Date) => MultipleItemQuery<Appointment>,
        private deleteQuery: (event: CalendarEventModel<Appointment>) => DeleteItemQuery,
        private editFormBuilder: (event: CalendarEventModel<Appointment>) => DataFormBuilder<Appointment>,
        private insertFormBuilder: (attendee: CalendarEventAttendee<User>) => DataFormBuilder<Appointment>,
        private attendeesDataTableBuilder: DataTableBuilder<User>
    ) {
        // set locale
        this.config.locale = locale;

        // set fetch events functoin
        this.config.fetchEvents = (date) => fetchQuery(date)
            .includeMultiple(['Location', 'Client'])
            .get().map(response => {
                return response.items.map(item => new CalendarEventModel<Appointment>(
                    item,
                    item.appointmentName,
                    new Date(item.appointmentDate),
                    new Date(item.appointmentEndDate),
                    this.getColor(item),
                    item.client.getFullName()
                ));
            });

        // set delete method
        this.config.delete = (event) => deleteQuery(event).set().map(response => new CalendarDeleteResponse());

        // build forms
        this.config.editEventFormConfig = (event) => editFormBuilder(event)
            .wrapInCard(false)
            .renderButtons(false)
            .build();

        this.config.insertEventFormConfig = (attendee: CalendarEventAttendee<User>) => insertFormBuilder(attendee)
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ClientId') {
                    return Observable.of(attendee.model.id);
                }
                return Observable.of(value);
            })
            .wrapInCard(false)
            .renderButtons(false)
            .build();

        // build attendees data table
        this.config.attendeesDataTableConfig = attendeesDataTableBuilder
            .renderPager(false)
            .build();
    }

    private getColor(item: Appointment): CalendarColor {
        if (item.location.locationTypeAsString === 'Office') {
            return CalendarColor.Yellow;
        }

        if (item.location.locationTypeAsString === 'FitnessCenter') {
            return CalendarColor.Red;
        }

        if (item.location.locationTypeAsString === 'Outdoors') {
            return CalendarColor.Blue;
        }

        return CalendarColor.Purple;
    }

    onEventClick(resolver: (event: CalendarEventModel<Appointment>) => void): this {
        this.config.onEventClick = resolver;
        return this;
    }

    onEventEditClick(resolver: (event: CalendarEventModel<Appointment>) => void): this {
        this.config.onEventEditClick = resolver;
        return this;
    }

    onEventDeleteClick(resolver: (event: CalendarEventModel<Appointment>) => void): this {
        this.config.onEventDeleteClick = resolver;
        return this;
    }

    delete(resolver: (event: CalendarEventModel<Appointment>) => Observable<CalendarDeleteResponse>): this {
        this.config.delete = resolver;
        return this;
    }

    build(): CalendarConfig {
        return this.config;
    }
}
