import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// components
import { PagerComponent } from './pager.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        SharedWebComponentModule
    ],
    declarations: [
        PagerComponent,
    ],
    exports: [
        PagerComponent
    ]
})
export class PagerModule { }