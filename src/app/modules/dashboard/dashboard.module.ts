import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
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