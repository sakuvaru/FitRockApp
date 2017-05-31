// Note: This module is used to import all angular material components
// https://material.angular.io/guide/getting-started

// https://teradata.github.io/covalent/#/docs/angular-material is built on top of Angular material but as of 1.0.0.4 (beta)
// Teradata does not seem to export Angular Material modules therefore they need to be imported

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// Angular material
import {
    MdDatepickerModule, MdSnackBarModule, MdNativeDateModule, MdAutocompleteModule,
    MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule,
    CompatibilityModule, MaterialModule, MdCommonModule, A11yModule, MdDialogModule, MdGridListModule,
    MdIconModule, MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule,
    MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectionModule, MdSelectModule, MdSidenavModule,
    MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule, ObserveContentModule,
    OverlayModule, PlatformModule, PortalModule, RtlModule, ScrollDispatchModule, StyleModule
} from '@angular/material';


@NgModule({
    imports: [
        MdDatepickerModule, MdSnackBarModule, MdNativeDateModule, MdAutocompleteModule,
        MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule,
        CompatibilityModule, MaterialModule, MdCommonModule, A11yModule, MdDialogModule, MdGridListModule,
        MdIconModule, MdInputModule, MdLineModule, MdListModule, MdMenuModule, MdOptionModule, MdProgressBarModule,
        MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectionModule, MdSelectModule, MdSidenavModule,
        MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule, ObserveContentModule,
        OverlayModule, PlatformModule, PortalModule, RtlModule, ScrollDispatchModule, StyleModule
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
        MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectionModule, MdSelectModule, MdSidenavModule,
        MdSliderModule, MdSlideToggleModule, MdTabsModule, MdToolbarModule, MdTooltipModule, NativeDateModule, ObserveContentModule,
        OverlayModule, PlatformModule, PortalModule, RtlModule, ScrollDispatchModule, StyleModule
    ]
})
export class AngularMaterialModule { }