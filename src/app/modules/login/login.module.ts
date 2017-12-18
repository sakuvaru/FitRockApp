import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../../core';
import { LoginFormComponent } from './login-form.component';
import { LoginPageComponent } from './login-page.component';
import { LoginRouter } from './login.routing';
import { LogoutComponent } from './logout.component';
import { RegisterFormComponent } from './register-form.component';
import { RegisterPageComponent } from './register-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoginRouter,
        CoreModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginPageComponent,
        LoginFormComponent,
        LogoutComponent,
        RegisterPageComponent,
        RegisterFormComponent
    ],
    exports: [
        LoginFormComponent
    ]
})
export class LoginModule { }
