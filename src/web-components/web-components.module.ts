import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnimateModule } from './animate/animate.module';
import { BadgesModule } from './badges/badges.module';
import { BoxesModule } from './boxes/boxes.module';
import { ButtonsModule } from './buttons/buttons.module';
import { CalendarModule } from './calendar/calendar.module';
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
import { TitlesModule } from './titles/title.module';
import { UploaderModule } from './uploader/uploader.module';
import { WebTableModule } from './web-table/web-table.module';

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
        CalendarModule,
        BoxesModule,
        AnimateModule,
        BadgesModule,
        TitlesModule,
        WebTableModule
    ]
})
export class WebComponentsModule {
}
