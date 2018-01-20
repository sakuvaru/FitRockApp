import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { LoginFormComponent } from './forms/login-form.component';
import { RegisterFormComponent } from './forms/register-form.component';
import { ResetPasswordFormComponent } from './forms/reset-password-form.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
    ],
    declarations: [
        LoginFormComponent,
        RegisterFormComponent,
        ResetPasswordFormComponent
    ],
    exports: [
        LoginFormComponent,
        RegisterFormComponent,
        ResetPasswordFormComponent
    ],
})
export class AuthenticationModule { }
