// Note: This module is used to import all angular material components
// https://material.angular.io/guide/getting-started

// https://teradata.github.io/covalent/#/docs/angular-material is built on top of Angular material ->
// and therefore it shouldn't be required to include these modules separatelly. The MdDatePickerModule
// is here only because Teradata is references older version of angular material that does not include it

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// Angular material
import { MdDatepickerModule } from '@angular/material';
import { MdSnackBarModule } from '@angular/material';
import { MdNativeDateModule } from '@angular/material';

@NgModule({
    imports: [
       MdDatepickerModule,
       MdSnackBarModule,
       MdNativeDateModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
        MdDatepickerModule,
        MdNativeDateModule
    ]
})
export class AngularMaterialModule { }