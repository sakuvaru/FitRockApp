import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRouter } from './login.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoginRouter
    ],
    declarations: [
        LoginComponent,
    ]
})
export class LoginModule { }