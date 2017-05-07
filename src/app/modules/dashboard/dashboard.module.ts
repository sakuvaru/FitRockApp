import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// components
import { DashboardComponent } from './dashboard.component';

// router
import { DashboardRouter } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DashboardRouter
    ],
    declarations: [
        DashboardComponent,
    ]
})
export class DashboardModule { }