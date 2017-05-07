import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// components
import { LoginRouter } from './login.routing';

// router
import { LoginFormComponent } from './login-form.component';
import { LoginPageComponent } from './login-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoginRouter,
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