import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { EditProgressTypeComponent } from './edit/edit-progress-type.component';
import { GlobalProgressTypesListComponent } from './list/global-progress-types-list.component';
import { MyProgressTypesListComponent } from './list/my-progress-types-list.component';
import { NewProgressTypeComponent } from './new/new-progress-type.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        EditProgressTypeComponent,
        GlobalProgressTypesListComponent,
        MyProgressTypesListComponent,
        NewProgressTypeComponent
    ],
    exports: [
        EditProgressTypeComponent,
        GlobalProgressTypesListComponent,
        MyProgressTypesListComponent,
        NewProgressTypeComponent
    ]
})
export class ProgressItemTypesModule { }
