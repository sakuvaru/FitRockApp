import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { LoginPageComponent } from './login-page.component';
import { LoginRouter } from './login.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoginRouter
    ],
    declarations: [
        LoginPageComponent,
        LoginFormComponent
    ],
    exports:[
        LoginFormComponent
    ]
})
export class LoginModule { }