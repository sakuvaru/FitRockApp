import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig } from '../../core';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { SampleComponent } from './_sample.component';

const routes: Routes = [
    {
        path: AppConfig.ClientPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            { path: 'sampleRoute', component: SampleComponent },
        ]
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SampleRouter { }