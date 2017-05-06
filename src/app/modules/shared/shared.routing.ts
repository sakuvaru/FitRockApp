import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConfig } from '../../core/config/app.config';
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

export const routes: Routes = [
  { path: AppConfig.PublicPath, component: SimpleLayoutComponent, children:[
     { path: AppConfig.NotFoundPath, component: NotFoundComponent},
     { path: AppConfig.UnauthorizedPath, component: UnauthorizedComponent},
  ]}
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