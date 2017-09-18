import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { MessagesModule } from '../messages';

// components
import { LoadMoreComponent } from './load-more.component';

// services
import { LoadMoreService } from './load-more.service';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components
        FormsModule, // search control is used in load more
        ReactiveFormsModule,
        MessagesModule
    ],
    declarations: [
        LoadMoreComponent,
    ],
    exports: [
        LoadMoreComponent,
    ],
    providers: [
        LoadMoreService
    ]
})
export class LoadMoreModule { }