import { NgModule } from '@angular/core';

// services to import
import { GalleryService, GraphService, LoadMoreService, 
    UploaderService, DataTableService, DataFormService
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
        DataFormService
    ]
})
export class WebComponentServicesModule { }
