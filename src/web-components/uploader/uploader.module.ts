import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoaderModule } from '../loader/loader.module';
import { MessagesModule } from '../messages';
import { SharedWebComponentModule } from '../shared-web-components.module';
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
