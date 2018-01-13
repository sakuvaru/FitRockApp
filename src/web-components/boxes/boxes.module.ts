import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoaderModule } from '../loader/loader.module';
import { MapModule } from '../map/map.module';
import { MessagesModule } from '../messages/messages.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { InfoBoxComponent } from './info/info-box.component';
import { ListBoxComponent } from './list/list-box.component';
import { MapBoxComponent } from './map/map-box.component';
import { MiniBoxComponent } from './mini/mini-box.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule,
        MessagesModule,
        LoaderModule,
        MapModule
    ],
    declarations: [
        ListBoxComponent,
        InfoBoxComponent,
        MapBoxComponent,
        MiniBoxComponent
    ],
    exports: [
        ListBoxComponent,
        InfoBoxComponent,
        MapBoxComponent,
        MiniBoxComponent
    ]
})
export class BoxesModule { }
