import 'hammerjs';
import 'mousetrap';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalGalleryModule } from 'angular-modal-gallery';

import { ButtonsModule } from '../buttons/buttons.module';
import { LoaderModule } from '../loader/loader.module';
import { MessagesModule } from '../messages/messages.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { GalleryComponent } from './gallery.component';
import { TypographyModule } from '../typography';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components
        ModalGalleryModule,
        ButtonsModule,
        MessagesModule,
        LoaderModule,
        TypographyModule
    ],
    declarations: [
        GalleryComponent,
    ],
    exports: [
        GalleryComponent,
    ],
    entryComponents: [
    ]
})
export class GalleryModule { }
