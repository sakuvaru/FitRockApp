import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// web modules
import { ButtonsModule } from './buttons/buttons.module';
import { DataTableModule } from './data-table/data-table.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { LoaderModule } from './loader/loader.module';
import { PagerModule } from './pager/pager.module';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
        DynamicFormModule,
        DataTableModule,
        ButtonsModule,
        LoaderModule,
        PagerModule
    ]
})
export class WebComponentsModule { }