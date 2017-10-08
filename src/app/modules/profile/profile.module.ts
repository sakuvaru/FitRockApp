import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { EditMyProfileComponent } from './edit/edit-my-profile.component';
import { FeedsComponent } from './feeds/feeds.component';
import { EditAvatarComponent } from './edit/edit-avatar.component';

// router
import { ProfileRouter } from './profile.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ProfileRouter,
        SharedModule
    ],
    declarations: [
        EditMyProfileComponent,
        FeedsComponent,
        EditAvatarComponent
    ]
})
export class ProfileModule { }
