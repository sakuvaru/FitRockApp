import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { AppErrorPageComponent } from './pages/app-error-page.component';
import { ItemNotFoundPageComponent } from './pages/item-not-found-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { ServerDownPageComponent } from './pages/server-down-page.component';
import { UnauthorizedPageComponent } from './pages/unauthorized-page.component';
import { SharedRouter } from './shared.routing';
import { RedirectComponent } from './special/redirect.component';

@NgModule({
    imports: [
        CommonModule,
        SharedRouter,
        PagesCoreModule,
    ],
    declarations: [
        NotFoundPageComponent,
        ItemNotFoundPageComponent,
        RedirectComponent,
        AppErrorPageComponent,
        RedirectComponent,
        ServerDownPageComponent,
        UnauthorizedPageComponent
    ],
})
export class SharedPagesModule { }
