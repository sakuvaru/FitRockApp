import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../covalent.lib';

// Angular meterial
import { AngularMaterialModule } from '../material.lib'

@NgModule({
    imports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule
    ],
    declarations: [
    ],
    providers:[
    ],
    exports: [
        CovalentModule,
        AngularMaterialModule
    ]
})
export class SharedWebComponentModule { }