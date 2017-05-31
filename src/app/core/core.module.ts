import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from './app-data.service';
import { ComponentDependencyService } from './component-dependency.service';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../core/covalent/covalent.module';

// Angular meterial
import { AngularMaterialModule } from './material/angular-material.module';

// core modules - include
import { WebComponentsModule } from './web-components/web-components.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
    imports: [
        CommonModule,
        WebComponentsModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule
    ],
    declarations: [
    ],
    providers:[
        AppDataService,
        ComponentDependencyService
    ],
    exports: [
        WebComponentsModule,
        AuthModule,
        CovalentModule,
        AngularMaterialModule
    ]
})
export class CoreModule { }