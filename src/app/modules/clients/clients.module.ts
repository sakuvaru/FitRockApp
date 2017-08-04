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
import { WorkoutClientComponent } from './workout/edit/workout-client.component';
import { WorkoutClientEditComponent } from './workout/edit/workout-client-edit.component';

// router
import { ClientsRouter } from './clients.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ClientsRouter,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CdkTableModule
    ],
    declarations: [
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        WorkoutClientComponent,
        WorkoutClientEditComponent
    ]
})
export class ClientsModule { }