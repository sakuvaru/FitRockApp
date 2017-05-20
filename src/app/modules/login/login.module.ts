import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// core module
import { CoreModule } from '../../core/core.module';

// router
import { LoginRouter } from './login.routing';

// componets
import { LoginFormComponent } from './login-form.component';
import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoginRouter,
        CoreModule
    ],
    declarations: [
        LoginPageComponent,
        LoginFormComponent,
        LogoutComponent
    ],
    exports:[
        LoginFormComponent
    ]
})
export class LoginModule { }