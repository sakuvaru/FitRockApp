import { CalendarColor } from './calendar.enums';
import { Observable } from 'rxjs/Rx';

import { CalendarConfig } from './calendar.config';
import { CalendarEventModel, CalendarDeleteResponse } from './calendar.models';
import { Appointment } from '../../app/models';
import { MultipleItemQuery, DeleteItemQuery } from '../../lib/repository';

export class CalendarBuilder {

    private readonly config: CalendarConfig = new CalendarConfig();

    constructor(
        private locale: string,
        private fetchQuery: (date: Date) => MultipleItemQuery<Appointment>,
        private deleteQuery: (event: CalendarEventModel<Appointment>) => DeleteItemQuery
    ) {
        this.config.locale = locale;

        this.config.fetchEvents = (date) => fetchQuery(date)
            .includeMultiple(['Location', 'Client'])
            .get().map(response => {
                return response.items.map(item => new CalendarEventModel<Appointment>(
                    item,
                    item.appointmentName,
                    new Date(item.appointmentDate),
                    this.getColor(item),
                    item.client.getFullName()
                ));
            });

        this.config.delete = (event) => deleteQuery(event).set().map(response => new CalendarDeleteResponse());
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
