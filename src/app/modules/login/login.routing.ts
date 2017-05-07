import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// config
import { AppConfig } from '../../core/config/app.config';

// components
import { LoginPageComponent } from './login-page.component';

const routes: Routes = [
  {
    path: AppConfig.PublicPath, component: SimpleLayoutComponent, children: [
      { path: AppConfig.LoginPath, component: LoginPageComponent },
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
export class LoginRouter { }