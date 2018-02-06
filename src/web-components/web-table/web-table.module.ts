import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { TypographyModule } from '../typography';
import { WebTableLineComponent } from './web-table-line.component';
import { WebTableTitleComponent } from './web-table-title.component';
import { WebTableComponent } from './web-table.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule,
        TypographyModule
    ],
    declarations: [
        WebTableComponent,
        WebTableLineComponent,
        WebTableTitleComponent
    ],
    exports: [
        WebTableComponent,
        WebTableLineComponent,
        WebTableTitleComponent
    ]
})
export class WebTableModule { }
