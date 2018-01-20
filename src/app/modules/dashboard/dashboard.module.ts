import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../../core';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
    ],
    declarations: [
        DashboardComponent,
    ],
    exports: [
        DashboardComponent
    ]
})
export class DashboardModule { }
