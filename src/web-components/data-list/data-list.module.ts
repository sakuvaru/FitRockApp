import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedWebComponentModule } from '../shared-web-components.module';

// data list service
import { DataListService } from './data-list-service';

// components
import { DataListComponent } from './data-list.component';
import {
    DataListLayoutItemsComponent, DataListLayoutHeaderComponent, DataListLayoutFieldComponent,
    DataListLayoutFiltersComponent, DataListLayoutPagerComponent, DataListLayoutSearchComponent
} from './layouts/layouts.components';

// loader
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        LoaderModule, // loader
        FormsModule, // search component is using forms module
        ReactiveFormsModule
    ],
    declarations: [
        DataListComponent,
        DataListLayoutItemsComponent,
        DataListLayoutFiltersComponent,
        DataListLayoutPagerComponent,
        DataListLayoutSearchComponent,
        DataListLayoutHeaderComponent,
        DataListLayoutFieldComponent
    ],
    exports: [
        DataListComponent
    ],
    providers: [
        DataListService
    ]
})
export class DataListModule { }
