import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// base layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { EditMyProfileComponent } from './edit/edit-my-profile.component';
import { FeedsComponent } from './feeds/feeds.component';

const routes: Routes = [
    {
        // profile
        path: UrlConfig.AuthMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'profile/edit', component: EditMyProfileComponent
            },
            {
                path: 'profile/feeds', component: FeedsComponent
            },
        ],
    },
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
export class ProfileRouter { }