import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../app-data.service';
import { ComponentDependencyService } from '../component-dependency.service';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../covalent/covalent.module';

// Angular meterial
import { AngularMaterialModule } from '../material/angular-material.module';

@NgModule({
    imports: [
        CommonModule,
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
        CovalentModule,
        AngularMaterialModule
    ]
})
export class SharedWebComponentModule { }