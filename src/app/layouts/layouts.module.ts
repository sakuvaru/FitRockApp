import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreModule } from '../core/core.module';

import { SimpleLayoutComponent } from './simple-layout.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { FooterComponent } from './shared/footer.component';
import { AdminToolbarComponent } from './shared/admin-toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, 
        CoreModule
    ],
    declarations: [
        SimpleLayoutComponent,
        AdminLayoutComponent,
        FooterComponent,
        AdminToolbarComponent
    ],
    exports: [
        SimpleLayoutComponent,
        AdminLayoutComponent,
        FooterComponent,
        AdminToolbarComponent
    ]
})
export class LayoutsModule { }
