// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Covalent modules
// Info: https://teradata.github.io/covalent/#/docs
import { CovalentCoreModule } from '@covalent/core';

// material angular
// Info: https://material.angular.io/guide/getting-started
import 'hammerjs';

// authentication
import { AuthModule } from './core/auth/auth.module';

// dynamic forms
import { DynamicFormModule} from './core/dynamic-form/dynamic-form.module';
import { FormServicesModule } from './forms/form-services.module';

// main app
import { AppComponent } from './app.component';

// custom modules
import { CoreModule } from './core/core.module';
import { LayoutsModule } from './layouts/layouts.module';
import { SharedModule } from './modules/shared/shared.module';
import { RepositoryModule } from './repository/repository.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { AppConfig } from './core/config/app.config';
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

    // covalent
    CovalentCoreModule,

    // authentication
    AuthModule,

    // dynamic forms
    DynamicFormModule,
    FormServicesModule,

    // custom modules
    CoreModule,
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

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
