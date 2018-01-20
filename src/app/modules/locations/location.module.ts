import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { EditLocationComponent } from './edit/edit-location.component';
import { MyLocationsComponent } from './list/my-locations.component';
import { NewLocationComponent } from './new/new-location.component';
import { PreviewLocationComponent } from './view/preview-location.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule, 
    ],
    declarations: [
        NewLocationComponent,
        MyLocationsComponent,
        EditLocationComponent,
        PreviewLocationComponent
    ],
    exports: [
        NewLocationComponent,
        MyLocationsComponent,
        EditLocationComponent,
        PreviewLocationComponent
    ]
})
export class LocationModule { }
