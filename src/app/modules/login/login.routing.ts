import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UrlConfig } from '../../config';
import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.Login, component: LoginPageComponent
      },
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.Logout, component: LogoutComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRouter { }
