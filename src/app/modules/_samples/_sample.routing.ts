import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { SampleComponent } from './_sample.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    { path: 'sampleRoute', component: SampleComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SampleRouter { }
