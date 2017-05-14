import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// form services
import { LogFormsService } from './log-forms.service';
import { ClientFormsService } from './client-forms.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers: [
        LogFormsService,
        ClientFormsService
    ]
})
export class FormServicesModule { }