import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.TrainerMasterPath, canActivate: [AuthGuardService], component: AdminLayoutComponent, children: [
          { path: UrlConfig.Dashboard, component: DashboardPageComponent },
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRouter { }
