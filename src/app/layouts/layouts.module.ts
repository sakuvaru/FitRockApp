import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

// components
import { SimpleLayoutComponent } from './simple-layout.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { FooterComponent } from './shared/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        CovalentCoreModule // covalent needs to be imported here as well because templates are using its modules
    ],
    declarations: [
        SimpleLayoutComponent,
        AdminLayoutComponent,
        FooterComponent
    ]
})
export class LayoutsModule { }