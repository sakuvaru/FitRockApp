// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material angular
// Info: https://material.angular.io/guide/getting-started
import 'hammerjs';

// authentication
import { AuthModule } from '../lib/auth.lib';

// dynamic forms
import { FormServicesModule } from './forms/form-services.module';

// main app
import { AppComponent } from './app.component';

// repository
import { RepositoryServiceProvider} from './core/providers/repository-service.provider';

// config
import { AppConfig } from './core/config/app.config';

// web components
import { WebComponentsModule } from '../lib/web-components.lib';

// custom modules
import { CoreModule } from './core';

import { LayoutsModule } from './layouts/layouts.module';
import { SharedModule } from './modules/shared/shared.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { ClientsModule } from './modules/clients/clients.module';

// test form module
import { FormModule } from './modules/_forms/_form.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    // Core module
    CoreModule,

    // route config
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: AppConfig.PublicPath + '/' + AppConfig.DefaultPath, pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: AppConfig.PublicPath + '/' + AppConfig.NotFoundPath
      }
    ]),

    // authentication
    AuthModule,

    // dynamic forms
    FormServicesModule,

    // custom modules
    LayoutsModule,
    SharedModule,
    DashboardModule,
    ServicesModule,
    LoginModule,
    ClientsModule,

    // test form module
    FormModule,

    // web components
    WebComponentsModule
  ],
  providers: [
    RepositoryServiceProvider
  ],
  exports: [
    WebComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
