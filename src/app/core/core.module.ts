import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from './app-data.service';
import { ComponentDependencyService } from './component-dependency.service';

// Covalent modules for Angular2 - include 
import { CovalentCoreModule } from '@covalent/core';

// core modules - include
import { WebComponentsModule } from './web-components/web-components.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
    imports: [
        CommonModule,
        WebComponentsModule,
        AuthModule,
        CovalentCoreModule
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
        CovalentCoreModule
    ]
})
export class CoreModule { }