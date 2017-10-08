import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// config
import { UrlConfig } from '../../core';

// components
import { LoginPageComponent } from './login-page.component';
import { LogoutComponent } from './logout.component';

const routes: Routes = [
  {
    path: UrlConfig.AuthMasterPath, component: SimpleLayoutComponent, children: [
      { path: UrlConfig.Login, component: LoginPageComponent },
      { path: UrlConfig.Logout, component: LogoutComponent },
    ]
  }
];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRouter { }
