import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { WorkoutsOverviewComponent } from './workouts-overview.component';

// router
import { WorkoutsRouter } from './workouts.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        WorkoutsRouter,
        SharedModule
    ],
    declarations: [
        WorkoutsOverviewComponent,
    ]
})
export class WorkoutsModule { }