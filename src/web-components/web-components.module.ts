import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// web modules
import { ButtonsModule } from './buttons/buttons.module';
import { DataListModule } from './data-list/data-list.module';
import { LoaderModule } from './loader/loader.module';
import { GraphModule } from './graph/graph.module';
import { MessagesModule } from './messages/messages.module';
import { LoadMoreModule } from './load-more/load-more.module';
import { UploaderModule } from './uploader/uploader.module';
import { GalleryModule } from './gallery/gallery.module';
import { TextModule } from './text/text.module';
import { MapModule } from './map/map.module';
import { ImagesModule } from './images/images.module';
import { ListingModule } from './listing/listing.module';
import { DataTableModule } from './data-table/data-table.module';
import { DataFormModule } from './data-form/data-form.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
        DataListModule,
        ButtonsModule,
        LoaderModule,
        GraphModule,
        MessagesModule,
        LoadMoreModule,
        UploaderModule,
        GalleryModule,
        TextModule,
        MapModule,
        ImagesModule,
        ListingModule,
        DataTableModule,
        DataFormModule,
        LayoutModule
    ]
})
export class WebComponentsModule { }
