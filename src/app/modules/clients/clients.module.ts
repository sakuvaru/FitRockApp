import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { ClientsOverviewComponent } from './clients-overview.component';
import { NewClientComponent } from './new-client.component';
import { ViewClientComponent } from './view-client.component';

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
        ViewClientComponent
    ]
})
export class ClientsModule { }