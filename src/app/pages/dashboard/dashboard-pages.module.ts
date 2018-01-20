import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardRouter } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        PagesCoreModule,
        DashboardRouter
    ],
    declarations: [
        DashboardPageComponent,
    ]
})
export class DashboardPagesModule { }
