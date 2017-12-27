import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { ListBoxComponent } from './list/list-box.component';
import { MessagesModule } from '../messages/messages.module';
import { LoaderModule } from '../loader/loader.module';
import { InfoBoxComponent } from './info/info-box.component';
import { MapBoxComponent } from './map/map-box.component';
import { MapModule } from '../map/map.module';

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
        MapBoxComponent
    ],
    exports: [
        ListBoxComponent,
        InfoBoxComponent,
        MapBoxComponent
    ]
})
export class BoxesModule { }
