import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';

// gallery module used: https://ks89.github.io/angular-modal-gallery.github.io/gettingStarted 
import { ModalGalleryModule } from 'angular-modal-gallery';
import 'hammerjs'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save hammerjs`)
import 'mousetrap'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save mousetrap`)

// components
import { GalleryComponent } from './gallery.component';

// services
import { GalleryService } from './gallery.service';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule, 
        RouterModule, // router needs to be importes so that routerLink can be used within components
        ModalGalleryModule
    ],
    declarations: [
        GalleryComponent,
    ],
    exports: [
        GalleryComponent,
    ],
    providers: [
        GalleryService
    ]
})
export class GalleryModule { }