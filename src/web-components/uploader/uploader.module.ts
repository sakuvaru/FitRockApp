import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// loader
import { LoaderModule } from '../loader/loader.module';

// messages module
import { MessagesModule } from '../messages';

// components
import { UploaderComponent } from './uploader.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components
        MessagesModule,
        LoaderModule
    ],
    declarations: [
        UploaderComponent,
    ],
    exports: [
        UploaderComponent,
    ]
})
export class UploaderModule { }
