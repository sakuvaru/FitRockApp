import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditAvatarPageComponent } from './edit/edit-avatar-page.component';
import { EditMyProfilePageComponent } from './edit/edit-my-profile-page.component';
import { MyFeedsPageComponent } from './feeds/my-feeds-page.component';
import { ProfileRouter } from './profile.routing';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        ProfileRouter,
    ],
    declarations: [
        EditAvatarPageComponent,
        EditMyProfilePageComponent,
        MyFeedsPageComponent
    ]
})
export class ProfilePagesModule { }
