import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { AddButtonComponent } from './actions/add-button.component';
import { CloseButtonComponent } from './actions/close-button.component';
import { DeleteButtonComponent } from './actions/delete-button.component';
import { EditButtonComponent } from './actions/edit-button.component';
import { FixedButtonComponent } from './actions/fixed-button.component';
import { FacebookButtonComponent } from './social/facebook-button.component';
import { GoogleButtonComponent } from './social/google-button.component';
import { TwitterButtonComponent } from './social/twitter-button.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule
    ],
    declarations: [
        FixedButtonComponent,
        DeleteButtonComponent,
        EditButtonComponent,
        CloseButtonComponent,
        AddButtonComponent,
        FacebookButtonComponent,
        GoogleButtonComponent,
        TwitterButtonComponent
    ],
    exports: [
        FixedButtonComponent,
        DeleteButtonComponent,
        EditButtonComponent,
        CloseButtonComponent,
        AddButtonComponent,
        FacebookButtonComponent,
        GoogleButtonComponent,
        TwitterButtonComponent
    ]
})
export class ButtonsModule { }
