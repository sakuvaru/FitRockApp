import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../lib/material'

// translation
import { TranslateModule } from '@ngx-translate/core';

// directives
import { DirectivesModule } from '../directives';

@NgModule({
    imports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        TranslateModule,
        DirectivesModule
    ],
    declarations: [
    ],
    providers:[
    ],
    exports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        TranslateModule,
        DirectivesModule
    ]
})
export class SharedWebComponentModule { }