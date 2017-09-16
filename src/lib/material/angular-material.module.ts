// Note: This module is used to import all angular material components
// https://material.angular.io/guide/getting-started

// Demo material module: https://github.com/angular/material2/blob/master/src/demo-app/demo-material-module.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// Angular material
import {
    MdDatepickerModule, MdSnackBarModule, MdNativeDateModule, MdAutocompleteModule,
    MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule,
    CompatibilityModule, MaterialModule, MdCommonModule, A11yModule, MdDialogModule, MdGridListModule,
    MdIconModule, MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule,
    MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule,
    MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule,
    PortalModule, StyleModule, MdTableModule,
    MdExpansionModule, MdPaginatorModule, MdSortModule
} from '@angular/material';

import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
    imports: [
        MdDatepickerModule, MdSnackBarModule, MdNativeDateModule, MdAutocompleteModule,
        MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule,
        CompatibilityModule, MaterialModule, MdCommonModule, A11yModule, MdDialogModule, MdGridListModule,
        MdIconModule, MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule,
        MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule,
        MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule,
        PlatformModule, PortalModule, StyleModule, MdTableModule,
        MdExpansionModule, MdPaginatorModule, MdSortModule,
        OverlayModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
        MdDatepickerModule, MdSnackBarModule, MdNativeDateModule, MdAutocompleteModule,
        MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule,
        CompatibilityModule, MaterialModule, MdCommonModule, A11yModule, MdDialogModule, MdGridListModule,
        MdIconModule, MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule,
        MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule,
        MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule,
        OverlayModule, PlatformModule, PortalModule, StyleModule, MdTableModule,
        MdExpansionModule, MdPaginatorModule, MdSortModule
    ]
})
export class AngularMaterialModule { }