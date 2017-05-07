import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

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
        CovalentCoreModule
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