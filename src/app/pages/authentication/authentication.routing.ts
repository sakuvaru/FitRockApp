import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UrlConfig } from '../../config';
import { LoginPageComponent } from './pages/login-page.component';
import { LogoutPageComponent } from './pages/logout-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page.component';
import { SessionLockPageComponent } from './pages/session-lock-page.component';
import { ProcessExternalLoginComponent } from './special/process-external-login.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.Login, component: LoginPageComponent
      },
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.Logout, component: LogoutPageComponent
      },
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.Register, component: RegisterPageComponent
      },
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.ResetPassword, component: ResetPasswordPageComponent
      },
      {
        path: UrlConfig.AuthMasterPath + '/' + UrlConfig.SessionLock, component: SessionLockPageComponent
      },
      {
        path: UrlConfig.ProcessExternalLogin, component: ProcessExternalLoginComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AuthenticationRouter { }
