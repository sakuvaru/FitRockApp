import { NgModule } from '@angular/core';

// services to import
import { DataListService, DynamicFormService, GalleryService, GraphService, LoadMoreService, 
    UploaderService, DataTableService, DataFormService
 } from './index';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        DataListService,
        DynamicFormService, 
        GalleryService,
        GraphService, 
        LoadMoreService,
        UploaderService,
        DataTableService,
        DataFormService
    ]
})
export class WebComponentServicesModule { }
