import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedWebComponentModule } from '../shared-web-components.module';

// data table service
import { DataTableService } from './data-table-service';

// components
import { DataTableComponent } from './data-table.component';
import {
    DataTableLayoutItemsComponent, DataTableLayoutHeaderComponent, DataTableLayoutFieldComponent,
    DataTableLayoutFiltersComponent, DataTableLayoutPagerComponent, DataTableLayoutSearchComponent
} from './layouts/layouts.components';

// loader
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        LoaderModule, // module is usinig loader,,
        FormsModule, // search component is using forms module
        ReactiveFormsModule
    ],
    declarations: [
        DataTableComponent,
        DataTableLayoutItemsComponent,
        DataTableLayoutFiltersComponent,
        DataTableLayoutPagerComponent,
        DataTableLayoutSearchComponent,
        DataTableLayoutHeaderComponent,
        DataTableLayoutFieldComponent
    ],
    exports: [
        DataTableComponent
    ],
    providers: [
        DataTableService
    ]
})
export class DataTableModule { }
