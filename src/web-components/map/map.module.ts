import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { MapComponent } from './map.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        AgmCoreModule
    ],
    declarations: [
        MapComponent,
    ],
    exports: [
        MapComponent,
    ]
})
export class MapModule { }
