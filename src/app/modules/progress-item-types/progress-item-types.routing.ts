import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// workouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

import { MyTypesListComponent } from './list/my-types-list.component';
import { GlobalTypesListComponent } from './list/global-types-list.component';
import { EditTypeComponent } from './edit/edit-type.component';
import { NewTypeComponent } from './new/new-type.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                // workouts
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'progress-item-types', component: MyTypesListComponent
                    },
                    {
                        path: 'progress-item-types/global', component: GlobalTypesListComponent
                    },
                    {
                        path: 'progress-item-types/new', component: NewTypeComponent
                    },
                    {
                        path: 'progress-item-types/edit/:id', component: EditTypeComponent
                    },
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProgressItemTypesRouter { }
