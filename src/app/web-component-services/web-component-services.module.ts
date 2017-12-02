import { NgModule } from '@angular/core';

// services to import
import { DataListService, GalleryService, GraphService, LoadMoreService, 
    UploaderService, DataTableService, DataFormService
 } from './index';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        DataListService,
        GalleryService,
        GraphService, 
        LoadMoreService,
        UploaderService,
        DataTableService,
        DataFormService
    ]
})
export class WebComponentServicesModule { }
