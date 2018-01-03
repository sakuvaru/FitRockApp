import { Observable } from 'rxjs/Rx';

import {
    DataFormEditDefinition,
    DataFormEditResponse,
    DataFormInsertDefinition,
    DataFormInsertResponse,
    DataFormBuilder,
    DataFormConfig,
} from '../data-form';
import { CalendarDeleteResponse, CalendarEventModel, CalendarEventAttendee } from './calendar.models';
import { DataTableConfig } from 'web-components/data-table/data-table.config';

export class CalendarConfig {

    /**
     * Calendar events
     */
    public fetchEvents: (date: Date) => Observable<CalendarEventModel<any>[]>;

    /**
     * On event click
     */
    public onEventClick?: (event: CalendarEventModel<any>) => void;

    /**
     * On event edit click
     */
    public onEventEditClick?: (event: CalendarEventModel<any>) => void;

    /**
     * On event delete click
     */
    public onEventDeleteClick?: (event: CalendarEventModel<any>) => void;

    /**
     * Method for handling event deletes
     */
    public delete?: (event: CalendarEventModel<any>) => Observable<CalendarDeleteResponse>;

    /**
     * Locale used for localization of calendar
     */
    public locale: string = 'en';

    /**
     * Edit event form config
     */
    public editEventFormConfig: (event: CalendarEventModel<any>) => DataFormConfig;

    /**
     * Insert event form config
     */
    public insertEventFormConfig: (attendee: CalendarEventAttendee<any>) =>  DataFormConfig;

    /**
     * Data table used to display list of attendees
     */
    public attendeesDataTableConfig: DataTableConfig;
}
