import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { EventAction, EventColor } from 'calendar-utils';
import { isSameDay, isSameMonth } from 'date-fns';
import { LocalizationService } from 'lib/localization';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Rx';
import { CalendarEventModel } from 'web-components/calendar';
import { CalendarEditEventDialogComponent } from 'web-components/calendar/dialogs/calendar-edit-event-dialog.component';
import { CalendarInsertEventDialogComponent } from 'web-components/calendar/dialogs/calendar-insert-event-dialog.component';
import {
    CalendarSelectAttendeeDialogComponent,
} from 'web-components/calendar/dialogs/calendar-select-attendee-dialog.component';

import { BaseWebComponent } from '../base-web-component.class';
import { Blue, Purple, Red, Yellow } from './calendar.colors';
import { CalendarConfig } from './calendar.config';
import { CalendarColor } from './calendar.enums';
import { CalendarDeleteResponse, CalendarEventAttendee } from './calendar.models';
import { CustomEventTitleFormatter } from './custom-event-title.formatter';

@Component({
    selector: 'calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'calendar.component.html',
    providers: [
        {
            provide: CalendarEventTitleFormatter,
            useClass: CustomEventTitleFormatter
        }
    ]
})
export class CalendarComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() config: CalendarConfig;

    /**
     * Subject that triggers loading of events
     */
    private readonly loadEventsSubject = new Subject<LoadEventsArgs>();

    /**
     * Subject for deleting item
     */
    private readonly deleteEventSubject = new Subject<CalendarModelInternal>();

    /**
     * Subject used for refreshing the calendar
     */
    private readonly calendarRefresh = new Subject<void>();

    /**
     * Indicates if full calendar should be shown (even on mobile)
     */
    public forceShowFullCalendar: boolean = false;

    /**
     * Highlighted date (uses current date by default)
     */
    public viewDate: Date = new Date();

    /**
     * Indicates if row with day data is opened for active day
     */
    public activeDayIsOpen: boolean = false;

    /**
     * Collection of events
     */
    public events: CalendarModelInternal[] = [];

    public currentDateRange: Date = new Date();

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
     * Indicates if calendar is initialized
     */
    private initialized: boolean = false;

    /**
     * Default locale
     */
    private defaultLocale: string = 'en';

    /** 
     * Error message
     */
    private errorMessage?: string;

    /**
    * Translations
    */
    private translations = {
        'delete': {
            'message': '',
            'cancel': '',
            'confirm': '',
            'title': '',
            'tooltip': '',
            'deleted': ''
        },
        'calendarError': '',
        'deleteError': ''
    };

    constructor(
        private localizationService: LocalizationService,
        private dialogService: TdDialogService
    ) { super(); }

    ngOnInit(): void {
        this.initCalendar();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initCalendar();
    }

    loadEvents(closeActiveDay: boolean = true): void {
        this.loadEventsSubject.next(new LoadEventsArgs(closeActiveDay));
    }

    eventClicked(event: CalendarModelInternal): void {
        if (this.config.onEventClick) {
            this.config.onEventClick(event.meta.eventModel);
        }
    }

    dayClicked({
        date,
        events
      }: {
            date: Date;
            events: CalendarModelInternal[]
        }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    changeDate(date: Date): void {
        this.currentDateRange = date;
        this.loadEvents();
    }

    openSelectAttendeeDialog(): void {
        const data: any = {};

        // this anonymous property is accessed by the dialog
        data.dataTableConfig = this.config.attendeesDataTableConfig;

        const dialog = this.dialogService.open(CalendarSelectAttendeeDialogComponent, {
            data: data,
            width: '70%'
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.selectedAttendee) {
                // attendee was selected, open new event dialog
                this.openNewEventDialog(dialog.componentInstance.selectedAttendee);
            }
        });
    }

    private openNewEventDialog(selectedAttendee: any): void {
        const data: any = {};

        // this anonymous property is accessed by the dialog
        data.formConfig = this.config.insertEventFormConfig(new CalendarEventAttendee(selectedAttendee));

        const dialog = this.dialogService.open(CalendarInsertEventDialogComponent, {
            data: data,
            width: '70%'
        });

        dialog.afterClosed().subscribe(m => {

        });
    }

    private openEditEventDialog(event: CalendarEventModel<any>): void {
        const data: any = {};

        // this anonymous property is accessed by the dialog
        data.formConfig = this.config.editEventFormConfig(event);

        const dialog = this.dialogService.open(CalendarEditEventDialogComponent, {
            data: data,
            width: '70%'
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.dataChanged) {
                // reload events because they were modified
                this.loadEvents(false);
            }
        });
    }

    private initCalendar(): void {
        if (!this.config || this.initialized) {
            return;
        }

        this.initialized = true;

        // init translations
        this.initTranslations();

        // subscribe to event loads
        this.subscribeToEventLoads();

        // subscribe to delete
        this.subscribeToDelete();

        // and load events
        this.loadEvents();
    }

    private deleteConfirmation(event: CalendarModelInternal): void {
        this.dialogService.openConfirm({
            message: this.translations.delete.message,
            disableClose: false, // defaults to false
            title: this.translations.delete.title,
            cancelButton: this.translations.delete.cancel,
            acceptButton: this.translations.delete.confirm,
        }).afterClosed()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((accept: boolean) => {
                if (accept) {
                    this.deleteEventSubject.next(event);
                } else {
                    // user did not accepted delete
                }
            });
    }

    private resetErrors(): void {
        this.errorMessage = undefined;
    }

    private deleteItemObservable(event: CalendarModelInternal): Observable<CalendarDeleteResponse> {
        if (!this.config.delete) {
            throw Error(`Delete function was not provided`);
        }

        return this.config.delete(event.meta.eventModel);
    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.calendar.delete.message').map(text => this.translations.delete.message = text)
            .zip(this.localizationService.get('webComponents.calendar.delete.title').map(text => this.translations.delete.title = text))
            .zip(this.localizationService.get('webComponents.calendar.delete.cancel').map(text => this.translations.delete.cancel = text))
            .zip(this.localizationService.get('webComponents.calendar.delete.confirm').map(text => this.translations.delete.confirm = text))
            .zip(this.localizationService.get('webComponents.calendar.delete.tooltip').map(text => this.translations.delete.tooltip = text))
            .zip(this.localizationService.get('webComponents.calendar.delete.deleted').map(text => this.translations.delete.deleted = text))
            .zip(this.localizationService.get('webComponents.calendar.calendarError').map(text => this.translations.calendarError = text))
            .zip(this.localizationService.get('webComponents.calendar.deleteError').map(text => this.translations.deleteError = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private fetchEventsObservable(): Observable<CalendarModelInternal[]> {
        return this.config.fetchEvents(this.currentDateRange)
            .map(events => {
                return events.map(eventModel => new CalendarModelInternal({
                    title: eventModel.name,
                    start: eventModel.date,
                    actions: [
                        {
                            label: '<i class="fa fa-fw fa-pencil"></i>',
                            onClick: ({ event }: { event: CalendarEvent }): void => {
                                this.handleEdit(event);
                            }
                        },
                        {
                            label: '<i class="fa fa-fw fa-trash"></i>',
                            onClick: ({ event }: { event: CalendarEvent }): void => {
                                this.handleDelete(event);
                            }
                        }
                    ],
                    color: this.mapColor(eventModel.color),
                    meta: {
                        eventModel
                    }
                }));
            });
    }

    private handleEdit(event: CalendarModelInternal): void {
        if (this.config.onEventEditClick) {
            this.config.onEventEditClick(event.meta.eventModel);
        }

        this.openEditEventDialog(event.meta.eventModel);
    }

    private handleDelete(event: CalendarModelInternal): void {
        if (this.config.onEventDeleteClick) {
            this.config.onEventDeleteClick(event.meta.eventModel);
        }

        if (this.config.delete) {
            this.deleteConfirmation(event);
        }
    }

    private subscribeToDelete(): void {
        this.deleteEventSubject
            .do(() => {
                // reset error messages
                this.resetErrors();
                this.loaderEnabled = true;
            })
            .flatMap((event) => this.deleteItemObservable(event))
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                // reload calendar
                this.loadEvents();
            }, error => this.handleDeleteError(error));
    }

    private subscribeToEventLoads(): void {

        let loadArgs: LoadEventsArgs;

        this.loadEventsSubject
            .do(() => {
                this.resetErrors();
                this.loaderEnabled = true;
            })
            .switchMap((args) => {
                loadArgs = args;
                return this.fetchEventsObservable();
            })
            .map(events => {
                if (events) {
                    this.events = events;
                } else {
                    this.events = [];
                }
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.loaderEnabled = false;

                // refresh calendar
                this.calendarRefresh.next();

                // make sure active day is closed if set
                if (loadArgs.closeActiveDay) {
                    this.activeDayIsOpen = false;
                }
            }, error => this.handleLoadError(error));
    }

    private handleDeleteError(error: any): void {
        console.error(error);
        this.errorMessage = this.translations.deleteError;
    }

    private handleLoadError(error: any): void {
        console.error(error);
        this.errorMessage = this.translations.calendarError;
    }

    private mapColor(color: CalendarColor): EventColor {
        if (color === CalendarColor.Blue) {
            return Blue;
        }

        if (color === CalendarColor.Purple) {
            return Purple;
        }

        if (color === CalendarColor.Red) {
            return Red;
        }

        if (color === CalendarColor.Yellow) {
            return Yellow;
        }

        return Yellow;
    }
}

class CalendarModelInternal implements CalendarEvent {
    public start: Date;
    public end?: Date | undefined;
    public title: string;
    public color: EventColor;
    public actions?: EventAction[] | undefined;
    public allDay?: boolean | undefined;
    public cssClass?: string | undefined;
    public resizable?: { beforeStart?: boolean | undefined; afterEnd?: boolean | undefined; } | undefined;
    public draggable?: boolean | undefined;
    public meta?: any;

    constructor(
        options: {
            start: Date;
            end?: Date | undefined;
            title: string;
            color: EventColor;
            actions?: EventAction[] | undefined;
            allDay?: boolean | undefined;
            cssClass?: string | undefined;
            resizable?: { beforeStart?: boolean | undefined; afterEnd?: boolean | undefined; } | undefined;
            draggable?: boolean | undefined;
            meta?: any;
        }
    ) {
        Object.assign(this, options);
    }
}

class LoadEventsArgs {
    constructor(
        public closeActiveDay: boolean
    ) { }
}



