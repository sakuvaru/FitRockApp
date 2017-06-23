import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// components
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { WorkoutsOverviewComponent } from './workouts-overview.component';

const routes: Routes = [
    {
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'workouts', component: WorkoutsOverviewComponent
            },
            {
                path: 'workouts/new', component: WorkoutsOverviewComponent
            },
            {
                path: 'workouts/edit/:id', component: WorkoutsOverviewComponent
            },
             {
                path: 'workouts/view/:id', component: WorkoutsOverviewComponent
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
export class WorkoutsRouter { }