import { DataTableBuilder } from '../../../web-components/data-table';
import { DataFormBuilder } from 'web-components/data-form';
import { DeleteItemQuery, MultipleItemQuery } from '../../../lib/repository';
import { CalendarBuilder, CalendarEventModel, CalendarEventAttendee } from '../../../web-components/calendar';
import { Appointment, User } from '../../models';

export class CalendarService {

    constructor(
    ) { }

    calendar(
        locale: string,
        fetchQuery: (date: Date) => MultipleItemQuery<Appointment>,
        deleteQuery: (event: CalendarEventModel<Appointment>) => DeleteItemQuery,
        editFormBuilder: (event: CalendarEventModel<Appointment>) => DataFormBuilder<Appointment>,
        insertFormBuilder: (attendee: CalendarEventAttendee<User>) => DataFormBuilder<Appointment>,
        attendeesDataTableBuilder: DataTableBuilder<User>
    ): CalendarBuilder {

        return new CalendarBuilder(locale, fetchQuery, deleteQuery, editFormBuilder, insertFormBuilder, attendeesDataTableBuilder);
    }
}




