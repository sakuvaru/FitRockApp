import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

import { ClientsOverviewComponent } from './list/client/clients-overview.component';
import { NewClientComponent } from './new/client/new-client.component';
import { EditClientComponent } from './edit/client/edit-client.component';
import { ActiveClientsComponent } from './list/client/active-clients.component';
import { InActiveClientsComponent } from './list/client/inactive-clients.component';
import { WorkoutClientComponent } from './edit/workout/workout-client.component';
import { WorkoutClientEditComponent } from './edit/workout/workout-client-edit.component';

const routes: Routes = [
    {
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'clients', component: ClientsOverviewComponent
            },
            {
                path: 'clients/new', component: NewClientComponent
            },
            {
                path: 'clients/edit/:id', component: EditClientComponent
            },
            {
                path: 'clients/active', component: ActiveClientsComponent
            },
            {
                path: 'clients/inactive', component: InActiveClientsComponent
            },
            {
                path: 'clients/edit/:id/workout', component: WorkoutClientComponent
            },
            {
                path: 'clients/edit/:id/workout/:workoutId', component: WorkoutClientEditComponent
            }
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