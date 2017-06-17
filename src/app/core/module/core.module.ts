import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared-service/shared.service';
import { ComponentDependencyService } from '../component/component-dependency.service';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../../../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../../../lib/material';

// core modules - include
import { AuthModule } from '../../../lib/auth';

// web components
import { WebComponentsModule } from '../../../lib/web-components';

// translation
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule,
        WebComponentsModule,
        TranslateModule
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
        WebComponentsModule,
        TranslateModule
    ]
})
export class CoreModule { }