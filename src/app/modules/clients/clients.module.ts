import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk';

// components
import { ClientsOverviewComponent } from './client/list/clients-overview.component';
import { NewClientComponent } from './client/new/new-client.component';
import { EditClientComponent } from './client/edit/edit-client.component';
import { EditClientWorkoutComponent } from './workout/edit/edit-client-workout.component';
import { ClientWorkoutComponent } from './workout/edit/client-workout.component';
import { EditClientWorkoutPlanComponent } from './workout/edit/edit-client-workout-plan.component';

// router
import { ClientsRouter } from './clients.routing';

// modules
import { SharedModule} from '../shared/shared.module';
import { WorkoutsModule} from '../workouts/workouts.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ClientsRouter,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CdkTableModule,
        WorkoutsModule
    ],
    declarations: [
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        EditClientWorkoutComponent,
        ClientWorkoutComponent,
        EditClientWorkoutPlanComponent
    ]
})
export class ClientsModule { }