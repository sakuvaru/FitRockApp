import { NgModule } from '@angular/core';

// services to import
import { LogService } from './log.service';
import { UserService } from './user.service';

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        LogService,
        UserService
    ]
})
export class ServicesModule { }