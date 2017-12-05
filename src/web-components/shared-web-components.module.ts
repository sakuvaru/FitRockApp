import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule, MediaQueriesModule } from '@angular/flex-layout';

import { DirectivesModule } from '../directives';
import { CovalentModule } from '../lib/covalent';
import { LocalizationModule } from '../lib/localization';
import { AngularMaterialModule } from '../lib/material';

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
