import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk';

// components
import { ClientsOverviewComponent } from './list/client/clients-overview.component';
import { NewClientComponent } from './new/client/new-client.component';
import { EditClientComponent } from './edit/client/edit-client.component';
import { ActiveClientsComponent } from './list/client/active-clients.component';
import { InActiveClientsComponent } from './list/client/inactive-clients.component';
import { WorkoutClientComponent } from './edit/workout/workout-client.component';

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
        ActiveClientsComponent,
        InActiveClientsComponent,
        WorkoutClientComponent
    ]
})
export class ClientsModule { }