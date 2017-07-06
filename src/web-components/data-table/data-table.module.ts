import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// data table service
import { DataTableService } from './data-table-service';

// components
import { DataTableComponent } from './data-table.component';

// loader
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        LoaderModule, // module is usinig loader,
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ],
    providers:[
        DataTableService
    ]
})
export class DataTableModule { }