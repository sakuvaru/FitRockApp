import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LoaderModule } from '../loader/loader.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { LineChartGraphComponent } from './graph-components/line-chart.component';
import { VerticalBarGraphComponent } from './graph-components/vertical-bar-chart.component';
import { PieChartComponent } from './graph-components/pie-chart.component';
import { GraphComponent } from './graph.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        LoaderModule, // loader module is used within graph
        BrowserModule, 
        BrowserAnimationsModule, 
        NgxChartsModule,
    ],
    declarations: [
        GraphComponent,
        VerticalBarGraphComponent,
        LineChartGraphComponent,
        PieChartComponent
    ],
    exports: [
        GraphComponent
    ]
})
export class GraphModule { }
