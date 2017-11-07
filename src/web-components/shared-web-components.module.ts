import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Flex layout for angular - https://www.npmjs.com/package/%40angular%2Fflex-layout
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../lib/material';

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
        DirectivesModule,
        FlexLayoutModule,
        MediaQueriesModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        TranslateModule,
        DirectivesModule,
        FlexLayoutModule,
        MediaQueriesModule
    ]
})
export class SharedWebComponentModule { }
