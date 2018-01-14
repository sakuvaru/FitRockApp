import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { CountUpComponent } from './countup/count-up.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule
    ],
    declarations: [
        CountUpComponent,

    ],
    exports: [
        CountUpComponent,
    ]
})
export class AnimateModule { }
