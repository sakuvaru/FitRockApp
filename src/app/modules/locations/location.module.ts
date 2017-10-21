import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// core module
import { CoreModule } from '../../core';

// components
import { NewLocationComponent } from './new/new-location.component';
import { MyLocationsComponent } from './list/my-locations.component';
import { EditLocationComponent } from './edit/edit-location.component';
import { PreviewLocationComponent } from './view/preview-location.component';

// router
import { LocationRouter } from './location.routing';


@NgModule({
    imports: [
        CommonModule,
        CoreModule, 
        LocationRouter,
    ],
    declarations: [
        NewLocationComponent,
        MyLocationsComponent,
        EditLocationComponent,
        PreviewLocationComponent
    ]
})
export class LocationModule { }
