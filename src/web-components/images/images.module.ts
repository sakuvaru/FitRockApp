import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// components
import { ImageComponent } from './image.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
    ],
    declarations: [
        ImageComponent,
    ],
    exports: [
        ImageComponent,
    ]
})
export class ImagesModule { }
