import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../app-data/app-data.service';
import { ComponentDependencyService } from '../component/component-dependency.service';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../../../lib/covalent.lib';

// Angular meterial
import { AngularMaterialModule } from '../../../lib/material.lib';

// core modules - include
import { AuthModule } from '../../../lib/auth.lib';

// web components
import { WebComponentsModule } from '../../../lib/web-components.lib';

@NgModule({
    imports: [
        CommonModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule,
        WebComponentsModule
    ],
    declarations: [
    ],
    providers:[
        AppDataService,
        ComponentDependencyService
    ],
    exports: [
        AuthModule,
        CovalentModule,
        AngularMaterialModule,
        WebComponentsModule
    ]
})
export class CoreModule { }