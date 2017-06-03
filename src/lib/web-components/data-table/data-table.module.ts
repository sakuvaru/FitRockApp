import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// components
import { DataTableComponent } from './data-table.component';

// pager
import { PagerModule } from '../pager/pager.module';

// loader
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        PagerModule ,// module is using pager,
        LoaderModule, // module is usinig loader,
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class DataTableModule { }