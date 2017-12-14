import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { AppConfig, UrlConfig } from '../../config';

// layouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

// components
import { ChatComponent } from './chat.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild([
      {
        path: UrlConfig.AuthMasterPath, canActivate: [AuthGuardService], component: AdminLayoutComponent, children: [
          { path: 'chat', component: ChatComponent },
          { path: 'chat/:id', component: ChatComponent },
        ],
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class ChatRouter { }
