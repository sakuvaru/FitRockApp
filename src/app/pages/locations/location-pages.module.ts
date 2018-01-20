import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditLocationPageComponent } from './edit/edit-location-page.component';
import { MyLocationsPageComponent } from './list/my-locations-page.component';
import { LocationRouter } from './location.routing';
import { NewLocationPageComponent } from './new/new-location-page.component';
import { PreviewLocationPageComponent } from './view/preview-location-page.component';

@NgModule({
    imports: [
        CommonModule,
        PagesCoreModule, 
        LocationRouter,
    ],
    declarations: [
        NewLocationPageComponent,
        MyLocationsPageComponent,
        EditLocationPageComponent,
        PreviewLocationPageComponent
    ]
})
export class LocationPagesModule { }
