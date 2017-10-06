// Note: This module is used to import all angular material components
// https://material.angular.io/guide/getting-started

// Demo material module: https://github.com/angular/material2/blob/master/src/demo-app/demo-material-module.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// Angular material
import {
    MATERIAL_COMPATIBILITY_MODE,
    MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
    MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
    CompatibilityModule, MatCommonModule, A11yModule, MatDialogModule, MatGridListModule,
    MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule,
    PortalModule, StyleModule, MatTableModule,
    MatExpansionModule, MatPaginatorModule, MatSortModule
} from '@angular/material';

import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
    imports: [
        MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
        MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
        CompatibilityModule, MatCommonModule, A11yModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
        MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
        MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule,
        PlatformModule, PortalModule, StyleModule, MatTableModule,
        MatExpansionModule, MatPaginatorModule, MatSortModule,
        OverlayModule
    ],
    declarations: [
    ],
    providers: [
        /* Forces the use of 'mat' instead of deprecated 'md' selectors as per https://www.npmjs.com/package/angular-material-prefix-updater*/
        { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true },
      ],
    exports: [
        MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
        MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
        CompatibilityModule, MatCommonModule, A11yModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
        MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
        MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule,
        OverlayModule, PlatformModule, PortalModule, StyleModule, MatTableModule,
        MatExpansionModule, MatPaginatorModule, MatSortModule
    ]
})
export class AngularMaterialModule { }