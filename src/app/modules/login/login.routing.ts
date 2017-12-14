import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// config
import { AppConfig, UrlConfig } from '../../config';

// components
import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.AuthMasterPath, component: SimpleLayoutComponent, children: [
          { path: UrlConfig.Login, component: LoginPageComponent },
          { path: UrlConfig.Logout, component: LogoutComponent },
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRouter { }
