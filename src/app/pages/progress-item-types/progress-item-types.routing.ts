import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditProgressTypePageComponent } from './edit/edit-progress-type-page.component';
import { GlobalProgressTypesListPageComponent } from './list/global-progress-types-list-page.component';
import { MyProgressTypesListPageComponent } from './list/my-progress-types-list-page.component';
import { NewProgressTypePageComponent } from './new/new-progress-type-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'progress-item-types', component: MyProgressTypesListPageComponent
                    },
                    {
                        path: 'progress-item-types/global', component: GlobalProgressTypesListPageComponent
                    },
                    {
                        path: 'progress-item-types/new', component: NewProgressTypePageComponent
                    },
                    {
                        path: 'progress-item-types/edit/:id', component: EditProgressTypePageComponent
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
