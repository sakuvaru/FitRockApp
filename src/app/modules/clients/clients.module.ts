import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { ClientsOverviewComponent } from './clients-overview.component';
import { NewClientComponent } from './new-client.component';
import { EditClientComponent } from './edit-client.component';
import { ActiveClientsComponent } from './active-clients.component';
import { InActiveClientsComponent } from './inactive-clients.component';

// router
import { ClientsRouter } from './clients.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ClientsRouter,
        SharedModule
    ],
    declarations: [
        ClientsOverviewComponent,
        NewClientComponent,
        EditClientComponent,
        ActiveClientsComponent,
        InActiveClientsComponent
    ]
})
export class ClientsModule { }