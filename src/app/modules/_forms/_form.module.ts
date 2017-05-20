import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core/core.module';

// components
import { FormComponent } from './_form.component';

// router
import { FormRouter } from './_form.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormRouter,
    ],
    declarations: [
        FormComponent,
    ]
})
export class FormModule { }