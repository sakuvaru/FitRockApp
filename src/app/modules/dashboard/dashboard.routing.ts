import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../core/auth/auth-guard.service';

// config
import { AppConfig } from '../../core/config/app.config';

// components
import { DashboardComponent } from './dashboard.component';
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

const routes: Routes = [
  {
    path: AppConfig.ClientPath, canActivate: [AuthGuardService], component: AdminLayoutComponent, children: [
      { path: '', component: DashboardComponent },
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
export class DashboardRouter { }