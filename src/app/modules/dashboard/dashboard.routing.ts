import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { AppConfig } from '../../core/config/app.config';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: AppConfig.DashboardPath, component: DashboardComponent, canActivate: [AuthGuardService] }
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