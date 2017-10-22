import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// AGM map module (https://angular-maps.com/guides/getting-started/)
import { AgmCoreModule } from '@agm/core';

// components
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
