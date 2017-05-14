import { NgModule } from '@angular/core';

// services to import
import { LogService } from './log.service';
import { ClientService } from './client.service';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        LogService,
        ClientService
    ]
})
export class ServicesModule { }