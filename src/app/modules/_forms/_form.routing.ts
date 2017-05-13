import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicFormModule } from '../../core/dynamic-form/dynamic-form.module';

// guard
import { AuthGuardService } from '../../core/auth/auth-guard.service';

// config
import { AppConfig } from '../../core/config/app.config';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { FormComponent } from './_form.component';

const routes: Routes = [
    {
        path: AppConfig.ClientPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            { path: 'form', component: FormComponent },
        ]
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes),
        DynamicFormModule
    ],
    exports: [
        RouterModule
    ]
})
export class FormRouter { }