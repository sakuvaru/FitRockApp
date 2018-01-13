import { NgModule } from '@angular/core';

import {
    CalendarService,
    DataFormService,
    DataTableService,
    GalleryService,
    GraphService,
    LoadMoreService,
    UploaderService,
    BoxService
} from './index';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        GalleryService,
        GraphService, 
        LoadMoreService,
        UploaderService,
        DataTableService,
        DataFormService,
        CalendarService,
        BoxService
    ],
})
export class WebComponentServicesModule { }
