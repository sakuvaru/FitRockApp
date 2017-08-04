import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

import { ClientsOverviewComponent } from './client/list/clients-overview.component';
import { NewClientComponent } from './client/new/new-client.component';
import { EditClientComponent } from './client/edit/edit-client.component';
import { WorkoutClientComponent } from './workout/edit/workout-client.component';
import { WorkoutClientEditComponent } from './workout/edit/workout-client-edit.component';

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