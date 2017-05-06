import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { LoginPageComponent } from './login-page.component';
import { AppConfig } from '../../core/config/app.config';

const routes: Routes = [
   { path: AppConfig.PublicPath, component: SimpleLayoutComponent, children:[
     { path: AppConfig.LoginPath, component: LoginPageComponent},
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
export class LoginRouter { }