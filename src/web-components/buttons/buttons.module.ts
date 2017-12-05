import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { AddButtonComponent } from './add-button.component';
import { CloseButtonComponent } from './close-button.component';
import { DeleteButtonComponent } from './delete-button.component';
import { EditButtonComponent } from './edit-button.component';
import { FixedButtonComponent } from './fixed-button.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components
    ],
    declarations: [
        FixedButtonComponent,
        DeleteButtonComponent,
        EditButtonComponent,
        CloseButtonComponent,
        AddButtonComponent
    ],
    exports: [
        FixedButtonComponent,
        DeleteButtonComponent,
        EditButtonComponent,
        CloseButtonComponent,
        AddButtonComponent
    ]
})
export class ButtonsModule { }
