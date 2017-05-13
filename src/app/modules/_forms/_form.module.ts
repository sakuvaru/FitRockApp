import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components
import { FormComponent } from './_form.component';

// router
import { FormRouter } from './_form.routing';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

// dynamic forms module
import { DynamicFormModule } from '../../core/dynamic-form/dynamic-form.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        CovalentCoreModule, // covalent needs to be imported here as well because templates are using its modules
        DynamicFormModule,
        FormRouter
    ],
    declarations: [
        FormComponent,
    ]
})
export class FormModule { }