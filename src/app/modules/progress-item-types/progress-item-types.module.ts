import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { MyTypesListComponent } from './list/my-types-list.component';
import { GlobalTypesListComponent } from './list/global-types-list.component';
import { EditTypeComponent } from './edit/edit-type.component';
import { NewTypeComponent } from './new/new-type.component';

// router
import { ProgressItemTypesRouter } from './progress-item-types.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ProgressItemTypesRouter,
        SharedModule
    ],
    declarations: [
        MyTypesListComponent,
        GlobalTypesListComponent,
        EditTypeComponent,
        NewTypeComponent
    ]
})
export class ProgressItemTypesModule { }