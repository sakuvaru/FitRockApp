import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditProgressTypePageComponent } from './edit/edit-progress-type-page.component';
import { GlobalProgressTypesListPageComponent } from './list/global-progress-types-list-page.component';
import { MyProgressTypesListPageComponent } from './list/my-progress-types-list-page.component';
import { NewProgressTypePageComponent } from './new/new-progress-type-page.component';
import { ProgressItemTypesRouter } from './progress-item-types.routing';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        ProgressItemTypesRouter,
    ],
    declarations: [
        EditProgressTypePageComponent,
        GlobalProgressTypesListPageComponent,
        MyProgressTypesListPageComponent,
        NewProgressTypePageComponent
    ]
})
export class ProgressItemTypePagesModule { }
