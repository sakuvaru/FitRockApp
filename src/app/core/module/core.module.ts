import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared-service/shared.service';
import { ComponentDependencyService } from '../component/component-dependency.service';

// Covalent modules for Angular  - include here so all components can reference them in templates
import { CovalentModule } from '../../../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../../../lib/material';

// Flex layout for angular - https://www.npmjs.com/package/%40angular%2Fflex-layout
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';

// core modules - include
import { AuthModule } from '../../../lib/auth';

// web components
import { WebComponentsModule } from '../../../web-components';

// translation
import { TranslateModule } from '@ngx-translate/core';

// directives
import { DirectivesModule } from '../../../directives';

// Drag & drop
// https://github.com/valor-software/ng2-dragula
import { DragulaModule } from 'ng2-dragula';

@NgModule({
    imports: [
        CommonModule,
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
    providers:[
        SharedService,
        ComponentDependencyService
    ],
    exports: [
        CommonModule,
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