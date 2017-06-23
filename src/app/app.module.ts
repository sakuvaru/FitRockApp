// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material angular
// Info: https://material.angular.io/guide/getting-started
import 'hammerjs';

// authentication
import { AuthModule } from '../lib/auth';

// main app
import { AppComponent } from './app.component';

// repository
import { RepositoryClientProvider } from './core/providers/repository-client.provider';

// config
import { AppConfig } from './core/config/app.config';
import { UrlConfig } from './core/config/url.config';

// web components
import { WebComponentsModule } from '../lib/web-components';

// translations
import { HttpLoaderFactory, CustomMissingTranslationHandler } from './core/providers/translate-loader.provider';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';

// custom modules
import { CoreModule } from './core';

import { LayoutsModule } from './layouts/layouts.module';
import { SharedModule } from './modules/shared/shared.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { ClientsModule } from './modules/clients/clients.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';

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
        redirectTo: UrlConfig.PublicMasterPath + '/' + UrlConfig.Default, pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: UrlConfig.PublicMasterPath + '/' + UrlConfig.NotFound
      }
    ]),

    // authentication
    AuthModule,

    // custom modules
    LayoutsModule,
    SharedModule,
    DashboardModule,
    ServicesModule,
    LoginModule,
    ClientsModule,
    WorkoutsModule,

    // translation
    TranslateModule.forRoot({
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),

    // test form module
    FormModule,

    // web components
    WebComponentsModule
  ],
  providers: [
    RepositoryClientProvider
  ],
  exports: [
    WebComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
