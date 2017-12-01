import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Flex layout for angular - https://www.npmjs.com/package/%40angular%2Fflex-layout
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';

// Covalent modules for Angular2 - include here so all components can reference them in templates
import { CovalentModule } from '../lib/covalent';

// Angular meterial
import { AngularMaterialModule } from '../lib/material';

// directives
import { DirectivesModule } from '../directives';

// localization
import { LocalizationModule } from '../lib/localization';

@NgModule({
    imports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        DirectivesModule,
        FlexLayoutModule,
        MediaQueriesModule,
        LocalizationModule
    ],
    declarations: [
    ],
    providers: [
    ],
    exports: [
        CommonModule,
        CovalentModule,
        AngularMaterialModule,
        DirectivesModule,
        FlexLayoutModule,
        MediaQueriesModule,
        LocalizationModule
    ]
})
export class SharedWebComponentModule { }
