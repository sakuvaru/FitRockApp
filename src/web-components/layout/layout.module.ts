import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// components
import { PageWrapperComponent } from './page-wrapper.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
    ],
    declarations: [
        PageWrapperComponent,
    ],
    exports: [
        PageWrapperComponent,
    ]
})
export class LayoutModule { }
