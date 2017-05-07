import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../auth/auth-guard.service';

// config
import { AppConfig } from '../../core/config/app.config';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { ClientsOverviewComponent } from './clients-overview.component';

const routes: Routes = [
    {
        path: AppConfig.ClientPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            { path: 'clients', component: ClientsOverviewComponent },
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
export class ClientsRouter { }