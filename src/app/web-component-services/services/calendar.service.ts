import { DeleteItemQuery, MultipleItemQuery } from '../../../lib/repository';
import { CalendarBuilder, CalendarEventModel } from '../../../web-components/calendar';
import { Appointment } from '../../models';

export class CalendarService {

    constructor(
    ) { }

    calendar(
        locale: string,
        fetchQuery: (date: Date) => MultipleItemQuery<Appointment>,
        deleteQuery: (event: CalendarEventModel<Appointment>) => DeleteItemQuery
    ): CalendarBuilder {

        return new CalendarBuilder(locale, fetchQuery, deleteQuery);
    }
}




