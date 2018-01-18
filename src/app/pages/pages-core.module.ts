import { NgModule } from '@angular/core';

import { CoreModule } from '../core';
import { LayoutsModule } from '../layouts/layouts.module';
import { ModulesModule } from '../modules/modules.module';

@NgModule({
    imports: [
        CoreModule,
        LayoutsModule,
        ModulesModule
    ],
    exports: [
        CoreModule,
        LayoutsModule,
        ModulesModule
    ]
})
export class PagesCoreModule { }
