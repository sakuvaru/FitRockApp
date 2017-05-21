import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// components
import { DataTableComponent } from './data-table.component';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

// pager
import { PagerModule } from '../pager/pager.module';

@NgModule({
    imports: [
        CommonModule,
        CovalentCoreModule, // covalent needs to be imported here as well because templates are using its modules
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        PagerModule // module is using pager
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class DataTableModule { }