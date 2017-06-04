import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// core
import { CoreModule, AppConfig } from '../../core';

// guard
import { AuthGuardService } from '../../../lib/auth';

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
        CoreModule
    ],
    exports: [
        RouterModule
    ]
})
export class FormRouter { }