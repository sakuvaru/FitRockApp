import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// base shared web components module
import { SharedWebComponentModule } from '../shared-web-components.module';

// modules
import { LoaderModule } from '../loader/loader.module';
import { MessagesModule } from '../messages/messages.module';

// components
import { DataTableComponent } from './data-table.component';
import { DataTablePagerComponent } from './data-table-pager.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
        LoaderModule, 
        FormsModule,
        ReactiveFormsModule,
        MessagesModule
    ],
    declarations: [
        DataTableComponent,
        DataTablePagerComponent
    ],
    exports: [
        DataTableComponent,
        DataTablePagerComponent
    ]
})
export class DataTableModule { }
