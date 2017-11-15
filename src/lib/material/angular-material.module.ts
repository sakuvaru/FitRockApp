// Note: This module is used to import all angular material components
// https://material.angular.io/guide/getting-started

// Demo material module: https://github.com/angular/material2/blob/master/src/demo-app/demo-material-module.ts

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

// Angular material
import {
    MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
    MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
    MatCommonModule, MatDialogModule, MatGridListModule,
    MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
    MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule, MatTableModule,
    MatExpansionModule, MatPaginatorModule, MatSortModule
} from '@angular/material';

import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';

@NgModule({
    imports: [
        MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
        MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
        MatCommonModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
        MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
        MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule,
        PlatformModule, MatTableModule,
        MatExpansionModule, MatPaginatorModule, MatSortModule,
        OverlayModule
    ],
    declarations: [
    ],
    exports: [
        MatDatepickerModule, MatSnackBarModule, MatNativeDateModule, MatAutocompleteModule,
        MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule,
        MatCommonModule, MatDialogModule, MatGridListModule,
        MatIconModule, MatInputModule, MatLineModule, MatListModule, MatMenuModule, MatOptionModule, MatProgressBarModule,
        MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
        MatSliderModule, MatSlideToggleModule, MatTabsModule, MatToolbarModule, MatTooltipModule, NativeDateModule,
        OverlayModule, PlatformModule, MatTableModule,
        MatExpansionModule, MatPaginatorModule, MatSortModule
    ]
})
export class AngularMaterialModule { }
