import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk';

// user components
import { ClientsOverviewComponent } from './client/list/clients-overview.component';
import { NewClientComponent } from './client/new/new-client.component';
import { EditClientComponent } from './client/edit/edit-client.component';

// workout components
import { EditClientWorkoutComponent } from './workout/edit/edit-client-workout.component';
import { ClientWorkoutComponent } from './workout/edit/client-workout.component';
import { EditClientWorkoutPlanComponent } from './workout/edit/edit-client-workout-plan.component';
import { NewClientWorkoutComponent } from './workout/new/new-client-workout.component';

// diet components
import { EditClientDietComponent } from './diet/edit/edit-client-diet.component';
import { ClientDietComponent } from './diet/edit/client-diet.component';
import { EditClientDietPlanComponent } from './diet/edit/edit-client-diet-plan.component';
import { NewClientDietComponent } from './diet/new/new-client-diet.component';

// router
import { ClientsRouter } from './clients.routing';

// modules
import { SharedModule} from '../shared/shared.module';
import { WorkoutsModule} from '../workouts/workouts.module';
import { DietsModule} from '../diets/diets.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ClientsRouter,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CdkTableModule,
        WorkoutsModule,
        DietsModule
    ],
    declarations: [
        // user
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        // workout
        EditClientWorkoutComponent,
        ClientWorkoutComponent,
        EditClientWorkoutPlanComponent,
        NewClientWorkoutComponent,
        // diet
        EditClientDietComponent,
        ClientDietComponent,
        EditClientDietPlanComponent,
        NewClientDietComponent
    ]
})
export class ClientsModule { }