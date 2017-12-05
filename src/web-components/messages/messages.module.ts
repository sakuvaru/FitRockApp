import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { NoDataMessageComponent } from './data/no-data-message.component';
import { ErrorMessageComponent } from './error/error-message.component';
import { InfoMessageComponent } from './info/info-message.component';
import { SuccessMessageComponent } from './success/success-message.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
    ],
    declarations: [
        InfoMessageComponent,
        NoDataMessageComponent,
        SuccessMessageComponent,
        ErrorMessageComponent
    ],
    exports: [
        InfoMessageComponent,
        NoDataMessageComponent,
        SuccessMessageComponent,
        ErrorMessageComponent
    ]
})
export class MessagesModule { }
