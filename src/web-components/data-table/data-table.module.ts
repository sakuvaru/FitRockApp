import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoaderModule } from '../loader/loader.module';
import { MessagesModule } from '../messages/messages.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { DataTablePagerComponent } from './data-table-pager.component';
import { DataTableComponent } from './data-table.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, 
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
