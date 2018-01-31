import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DragulaModule } from 'ng2-dragula';
import { BrowserModule } from '@angular/platform-browser';
import { DirectivesModule } from '../../directives';
import { AuthModule } from '../../lib/auth';
import { CovalentModule } from '../../lib/covalent';
import { LocalizationModule } from '../../lib/localization';
import { AngularMaterialModule } from '../../lib/material';
import { WebComponentsModule } from '../../web-components';
import { ComponentDependencyService } from './component/component-dependency.service';
import { AppLanguageResolver } from './providers/app-language-resolver';
import { BaseDialogComponent } from './component/types/base-dialog.component';
import {
    AuthenticatedUserService,
    CurrentLanguageService,
    LocalizationHelperService,
    NavigateService,
    RememberService,
    SharedService,
    SystemService,
    TimeService,
} from './services';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule,
        FlexLayoutModule,
        MediaQueriesModule,
        WebComponentsModule,
        DragulaModule,
        DirectivesModule,
        LocalizationModule,
    ],
    declarations: [
        BaseDialogComponent
    ],
    providers: [
        SharedService,
        ComponentDependencyService,
        AuthenticatedUserService,
        CurrentLanguageService,
        AppLanguageResolver,
        SystemService,
        TimeService,
        RememberService,
        NavigateService,
        LocalizationHelperService
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule,
        FlexLayoutModule,
        MediaQueriesModule,
        WebComponentsModule,
        DragulaModule,
        DirectivesModule,
        LocalizationModule,
    ]
})
export class CoreModule { }
