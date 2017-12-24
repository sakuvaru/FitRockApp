import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

import { DirectivesModule } from '../../directives';
import { AuthModule } from '../../lib/auth';
import { CovalentModule } from '../../lib/covalent';
import { LocalizationModule } from '../../lib/localization';
import { AngularMaterialModule } from '../../lib/material';
import { WebComponentsModule } from '../../web-components';
import { ComponentDependencyService } from './component/component-dependency.service';
import { AppLanguageResolver } from './providers/app-language-resolver';
import { AuthenticatedUserService } from './services/authenticated-user.service';
import { CurrentLanguageService } from './services/current-language.service';
import { SharedService } from './services/shared.service';
import { SystemService } from './services/system.service';
import { TimeService } from './services/time.service';
import { RememberService } from './services/remember.service';

@NgModule({
    imports: [
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
        LocalizationModule
    ],
    declarations: [
    ],
    providers: [
        SharedService,
        ComponentDependencyService,
        AuthenticatedUserService,
        CurrentLanguageService,
        AppLanguageResolver,
        SystemService,
        TimeService,
        RememberService
    ],
    exports: [
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
        LocalizationModule
    ]
})
export class CoreModule { }
