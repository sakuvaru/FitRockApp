import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonsModule } from './buttons/buttons.module';
import { DataFormModule } from './data-form/data-form.module';
import { DataTableModule } from './data-table/data-table.module';
import { GalleryModule } from './gallery/gallery.module';
import { GraphModule } from './graph/graph.module';
import { ImagesModule } from './images/images.module';
import { LayoutModule } from './layout/layout.module';
import { ListingModule } from './listing/listing.module';
import { LoadMoreModule } from './load-more/load-more.module';
import { LoaderModule } from './loader/loader.module';
import { MapModule } from './map/map.module';
import { MessagesModule } from './messages/messages.module';
import { TextModule } from './text/text.module';
import { UploaderModule } from './uploader/uploader.module';
import { CalendarModule } from './calendar/calendar.module';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    exports: [
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
        LayoutModule,
        CalendarModule
    ]
})
export class WebComponentsModule { }
