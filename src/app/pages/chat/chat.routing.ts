import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { ChatPageComponent } from './chat-page.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.AuthMasterPath, canActivate: [AuthGuardService], component: AdminLayoutComponent, children: [
          { path: 'chat', component: ChatPageComponent },
          { path: 'chat/:id', component: ChatPageComponent },
        ],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRouter { }
