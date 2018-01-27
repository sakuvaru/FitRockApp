import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { BadgeComponent } from './badge.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule,
    ],
    declarations: [
        BadgeComponent,
    ],
    exports: [
        BadgeComponent
    ]
})
export class BadgesModule { }
