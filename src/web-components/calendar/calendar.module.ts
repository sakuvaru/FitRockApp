import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CalendarModule as AngularCalendarModule } from 'angular-calendar';
import { MessagesModule } from 'web-components/messages';
import { ButtonsModule } from '../buttons/buttons.module';
import { DataFormModule } from '../data-form/data-form.module';
import { DataTableModule } from '../data-table';
import { LoaderModule } from '../loader/loader.module';
import { SharedWebComponentModule } from '../shared-web-components.module';

import { CalendarComponent } from './calendar.component';
import { CalendarEditEventDialogComponent } from './dialogs/calendar-edit-event-dialog.component';
import { CalendarInsertEventDialogComponent } from './dialogs/calendar-insert-event-dialog.component';
import { CalendarSelectAttendeeDialogComponent } from './dialogs/calendar-select-attendee-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AngularCalendarModule,
        SharedWebComponentModule,
        LoaderModule,
        MessagesModule,
        DataFormModule,
        ButtonsModule,
        DataTableModule
    ],
    entryComponents: [
        CalendarEditEventDialogComponent, 
        CalendarInsertEventDialogComponent,
        CalendarSelectAttendeeDialogComponent
    ],
    declarations: [
        CalendarComponent,
        CalendarEditEventDialogComponent, 
        CalendarInsertEventDialogComponent,
        CalendarSelectAttendeeDialogComponent,
    ],
    exports: [
        CalendarComponent
    ]
})
export class CalendarModule {
}


