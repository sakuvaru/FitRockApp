import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../covalent';

// Angular meterial
import { AngularMaterialModule } from '../material'

// translation
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        TranslateModule
    ],
    declarations: [
    ],
    providers:[
    ],
    exports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        TranslateModule
    ]
})
export class SharedWebComponentModule { }