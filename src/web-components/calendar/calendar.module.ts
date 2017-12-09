import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule as AngularCalendarModule } from 'angular-calendar';
import { CalendarComponent } from './calendar.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AngularCalendarModule.forRoot(),
    ],
    declarations: [
        CalendarComponent
    ],
    exports: [
        CalendarComponent
    ]
})
export class CalendarModule { }
