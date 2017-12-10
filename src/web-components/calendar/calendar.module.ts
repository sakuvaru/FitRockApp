import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CalendarModule as AngularCalendarModule } from 'angular-calendar';
import { MessagesModule } from 'web-components/messages';

import { LoaderModule } from '../loader/loader.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { CalendarComponent } from './calendar.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AngularCalendarModule,
        SharedWebComponentModule,
        LoaderModule, 
        MessagesModule
    ],
    declarations: [
        CalendarComponent
    ],
    exports: [
        CalendarComponent
    ]
})
export class CalendarModule {
   
 }


