import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// base shared web components module
import { SharedWebComponentModule } from '../shared-web-components.module';

// modules
import { LoaderModule } from '../loader/loader.module';

// ngx charts
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// components
import { GraphComponent } from './graph.component';

// graphs
import { VerticalBarGraphComponent } from './graph-components/vertical-bar-chart.component';
import { LineChartGraphComponent } from './graph-components/line-chart.component';

// service
import { GraphService } from './graph.service';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        LoaderModule, // loader module is used within graph
        BrowserModule, // ngx 
        BrowserAnimationsModule, // ngx
        NgxChartsModule // ngx
    ],
    declarations: [
        GraphComponent,
        VerticalBarGraphComponent,
        LineChartGraphComponent,
    ],
    exports: [
        GraphComponent
    ],
    providers: [
        GraphService
    ]
})
export class GraphModule { }
