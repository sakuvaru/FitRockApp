import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { EditMyProfileComponent } from './edit/edit-my-profile.component';

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
        EditMyProfileComponent
    ]
})
export class ProfileModule { }