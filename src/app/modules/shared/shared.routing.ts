import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConfig } from '../../core/config/app.config';
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
    { path: AppConfig.NotFoundPath, component: NotFoundComponent },
    { path: AppConfig.UnauthorizedPath, component: UnauthorizedComponent },
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