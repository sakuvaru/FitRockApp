import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// base shared web components module
import { SharedWebComponentModule } from '../shared-web-components.module';

// modules
import { LoaderModule } from '../loader/loader.module';

// components
import { DataTableComponent } from './data-table.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        LoaderModule, 
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class DataTableModule { }
