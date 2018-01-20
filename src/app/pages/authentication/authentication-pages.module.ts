import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { AuthenticationRouter } from './authentication.routing';
import { LoginPageComponent } from './pages/login-page.component';
import { LogoutPageComponent } from './pages/logout-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page.component';
import { SessionLockPageComponent } from './pages/session-lock-page.component';
import { ProcessExternalLoginComponent } from './special/process-external-login.component';

@NgModule({
    imports: [
        CommonModule,
        PagesCoreModule,
        AuthenticationRouter
    ],
    declarations: [
        LoginPageComponent,
        LogoutPageComponent,
        RegisterPageComponent,
        RegisterPageComponent,
        ResetPasswordPageComponent,
        ProcessExternalLoginComponent,
        SessionLockPageComponent
    ],
})
export class AuthenticationPagesModule { }
