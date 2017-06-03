import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from './app-data.service';
import { ComponentDependencyService } from './component-dependency.service';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from './covalent/covalent.module';

// Angular meterial
import { AngularMaterialModule } from './material/angular-material.module';

// core modules - include
import { AuthModule } from './auth/auth.module';

// web components
import { WebComponentsModule } from './web-components/web-components.module';

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