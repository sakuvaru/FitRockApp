import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth.lib';

// config
import { AppConfig } from '../../core';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { ClientsOverviewComponent } from './clients-overview.component';
import { NewClientComponent } from './new-client.component';
import { ViewClientComponent } from './view-client.component';

const routes: Routes = [
    {
        path: AppConfig.ClientPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'clients', component: ClientsOverviewComponent
            },
            {
                path: 'clients/new', component: NewClientComponent
            },
            {
                path: 'clients/view/:id', component: ViewClientComponent
            },
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