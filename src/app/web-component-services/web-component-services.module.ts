import { NgModule } from '@angular/core';

import {
    CalendarService,
    DataFormService,
    DataTableService,
    GalleryService,
    GraphService,
    LoadMoreService,
    UploaderService,
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
        CalendarService
    ],
})
export class WebComponentServicesModule { }
