import { Observable } from 'rxjs/Rx';
import { CalendarEventModel, CalendarDeleteResponse } from './calendar.models';

export class CalendarConfig {

    /**
     * Calendar events
     */
    public fetchEvents: (date: Date) => Observable<CalendarEventModel<any>[]>;

    public onEventClick?: (event: CalendarEventModel<any>) => void;

    public onEventEditClick?: (event: CalendarEventModel<any>) => void;

    public onEventDeleteClick?: (event: CalendarEventModel<any>) => void;

    public delete?: (event: CalendarEventModel<any>) => Observable<CalendarDeleteResponse>;

    /**
     * Locale used for localization of calendar
     */
    public locale?: string;

}
