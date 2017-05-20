import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// core module
import { CoreModule } from '../../core/core.module';

// components
import { DashboardComponent } from './dashboard.component';

// router
import { DashboardRouter } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        DashboardRouter
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule { }