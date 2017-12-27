import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { ListBoxComponent } from './list/list-box.component';
import { MessagesModule } from '../messages/messages.module';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, 
        MessagesModule,
        LoaderModule
    ],
    declarations: [
        ListBoxComponent,
    ],
    exports: [
        ListBoxComponent,
    ]
})
export class BoxesModule { }
