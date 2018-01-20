import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { AppErrorComponent } from './types/app-error.component';
import { ItemNotFoundComponent } from './types/item-not-found.component';
import { NotFoundComponent } from './types/not-found.component';
import { ServerDownComponent } from './types/server-down.component';
import { UnauthorizedComponent } from './types/unauthorized.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
    ],
    declarations: [
        ItemNotFoundComponent,
        NotFoundComponent,
        UnauthorizedComponent,
        AppErrorComponent,
        ServerDownComponent
    ],
    exports: [
        ItemNotFoundComponent,
        NotFoundComponent,
        UnauthorizedComponent,
        AppErrorComponent,
        ServerDownComponent
    ],
})
export class SharedModule { }
