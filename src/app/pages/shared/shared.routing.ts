import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UrlConfig } from '../../config';
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AppErrorPageComponent } from './pages/app-error-page.component';
import { ItemNotFoundPageComponent } from './pages/item-not-found-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';
import { ServerDownPageComponent } from './pages/server-down-page.component';
import { UnauthorizedPageComponent } from './pages/unauthorized-page.component';
import { RedirectComponent } from './special/redirect.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.Global404, component: NotFoundPageComponent
            },
            {
                path: UrlConfig.ServerDown, component: ServerDownPageComponent
            },
            {
                path: UrlConfig.AuthMasterPath, component: SimpleLayoutComponent, children: [
                    { path: UrlConfig.Unauthorized, component: UnauthorizedPageComponent },
                ]
            },
            {
                path: UrlConfig.SharedMasterPath, component: SimpleLayoutComponent, children: [
                    { path: UrlConfig.Item404, component: ItemNotFoundPageComponent },
                    { path: UrlConfig.AppError, component: AppErrorPageComponent },
                    { path: UrlConfig.Redirect, component: RedirectComponent },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class SharedRouter { }
