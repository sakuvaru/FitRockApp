import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CovalentModule } from '../../covalent/covalent.module';
import { AngularMaterialModule } from '../../material/angular-material.module';

// components
import { DataTableComponent } from './data-table.component';

// pager
import { PagerModule } from '../pager/pager.module';

// loader
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        CovalentModule, // covalent needs to be imported here as well because templates are using its modules
        RouterModule, // router needs to be importes so that routerLink can be used within components,
        PagerModule ,// module is using pager,
        LoaderModule, // module is usinig loader,
        AngularMaterialModule
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class DataTableModule { }