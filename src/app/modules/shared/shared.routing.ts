import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// config
import { AppConfig, UrlConfig } from '../../config';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { Global404Component } from './404.component';
import { Item404Component } from './item-404.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { AppErrorComponent } from './app-error.component';
import { RedirectComponent } from './redirect.component';
import { ServerDownComponent } from './server-down.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.Global404, component: Global404Component
            },
            {
                path: UrlConfig.ServerDown, component: ServerDownComponent
            },
            {
                path: UrlConfig.AuthMasterPath, component: SimpleLayoutComponent, children: [
                    { path: UrlConfig.Unauthorized, component: UnauthorizedComponent },
                ]
            },
            {
                path: UrlConfig.SharedMasterPath, component: SimpleLayoutComponent, children: [
                    { path: UrlConfig.Item404, component: Item404Component },
                    { path: UrlConfig.AppError, component: AppErrorComponent },
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
