import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from './services/shared.service';
import { ComponentDependencyService } from './component/component-dependency.service';

// angular forms
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

// Covalent modules for Angular  - include here so all components can reference them in templates
import { CovalentModule } from '../../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../../lib/material';

// Flex layout for angular - https://www.npmjs.com/package/%40angular%2Fflex-layout
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';

// core modules - include
import { AuthModule } from '../../lib/auth';

// web components
import { WebComponentsModule } from '../../web-components';

// translation
import { TranslateModule } from '@ngx-translate/core';

// directives
import { DirectivesModule } from '../../directives';

// Drag & drop
// https://github.com/valor-software/ng2-dragula
import { DragulaModule } from 'ng2-dragula';

// local authenticated user
import { AuthenticatedUserService } from './services/authenticated-user.service';

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
        TranslateModule,
        DragulaModule,
        DirectivesModule
    ],
    declarations: [
    ],
    providers: [
        SharedService,
        ComponentDependencyService,
        AuthenticatedUserService
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
        TranslateModule,
        DragulaModule,
        DirectivesModule
    ]
})
export class CoreModule { }
