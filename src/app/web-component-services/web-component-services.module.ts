import { NgModule } from '@angular/core';

// services to import
import { DataListService, DynamicFormService, GalleryService, GraphService, LoadMoreService, UploaderService
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
        UploaderService
    ]
})
export class WebComponentServicesModule { }
