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
import { AuthModule } from './core/auth/auth.module';

// dynamic forms
import { FormServicesModule } from './forms/form-services.module';

// main app
import { AppComponent } from './app.component';

// repository
import { RepositoryServiceProvider} from './core/providers/repository-service.provider';
import { RepositoryModule } from './repository/repository.module';

// config
import { AppConfig } from './core/config/app.config';

// custom modules
import { CoreModule } from './core/core.module';
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
    RepositoryModule,
    ServicesModule,
    LoginModule,
    ClientsModule,

    // test form module
    FormModule
  ],
  providers: [
    RepositoryServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
