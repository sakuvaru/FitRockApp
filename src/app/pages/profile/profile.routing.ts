import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditAvatarPageComponent } from './edit/edit-avatar-page.component';
import { EditMyProfilePageComponent } from './edit/edit-my-profile-page.component';
import { MyFeedsPageComponent } from './feeds/my-feeds-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.AuthMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'profile/edit', component: EditMyProfilePageComponent
                    },
                    {
                        path: 'profile/feeds', component: MyFeedsPageComponent
                    },
                    {
                        path: 'profile/avatar', component: EditAvatarPageComponent
                    },
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ProfileRouter { }
