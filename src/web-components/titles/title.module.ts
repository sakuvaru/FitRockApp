import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { Title1Component, Title2Component, Title3Component, Title4Component } from './titles';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule,
    ],
    declarations: [
        Title1Component,
        Title2Component,
        Title3Component,
        Title4Component
    ],
    exports: [
        Title1Component,
        Title2Component,
        Title3Component,
        Title4Component
    ]
})
export class TitlesModule { }
