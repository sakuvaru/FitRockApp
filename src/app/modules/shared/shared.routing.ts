import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// config
import { UrlConfig } from '../../core';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { ErrorComponent } from './error.component';

export const routes: Routes = [
    {
        path: UrlConfig.PublicMasterPath, component: SimpleLayoutComponent, children: [
            { path: UrlConfig.NotFound, component: NotFoundComponent },
            { path: UrlConfig.Unauthorized, component: UnauthorizedComponent },
            { path: UrlConfig.Error, component: ErrorComponent },
        ]
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SharedRouter { }