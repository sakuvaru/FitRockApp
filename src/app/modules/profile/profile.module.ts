import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { EditAvatarComponent } from './edit/edit-avatar.component';
import { EditMyProfileComponent } from './edit/edit-my-profile.component';
import { MyFeedsComponent } from './feeds/my-feeds.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
    ],
    declarations: [
        EditMyProfileComponent,
        EditAvatarComponent,
        MyFeedsComponent
    ],
    exports: [
        EditMyProfileComponent,
        EditAvatarComponent,
        MyFeedsComponent
    ]
})
export class ProfileModule { }
