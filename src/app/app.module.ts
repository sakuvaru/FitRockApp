// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// required by material angular + gallery
// Info: https://material.angular.io/guide/getting-started and https://ks89.github.io/angular-modal-gallery.github.io/gettingStarted
import 'hammerjs';

// required by gallery
// Info: https://ks89.github.io/angular-modal-gallery.github.io/gettingStarted
import 'mousetrap';
import { ModalGalleryModule } from 'angular-modal-gallery';

// entry point to application (redirection from Auth0)
import { EntryPointComponent } from './entry-point.component';

// 404
import { Global404Component } from './modules/shared/404.component';

// global error handler
import { GlobalErrorHandler } from './core/';

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
import { WebComponentsModule } from '../web-components';

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
import { ExercisesModule } from './modules/exercises/exercises.module';
import { DietsModule } from './modules/diets/diets.module';
import { FoodsModule } from './modules/foods/foods.module';
import { ProgressItemTypesModule } from './modules/progress-item-types/progress-item-types.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';

@NgModule({
  declarations: [
    AppComponent,
    Global404Component,
    EntryPointComponent
  ],
  imports: [
    // angular modules
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,

    // core module
    CoreModule,

    // route config
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: UrlConfig.EntryPoint, pathMatch: 'full'
      },
       {
        path: UrlConfig.EntryPoint,
        component: EntryPointComponent
      },
      {
        path: '**',
        redirectTo: UrlConfig.Global404
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
    ExercisesModule,
    DietsModule,
    FoodsModule,
    ProgressItemTypesModule,
    ProfileModule,
    ChatModule,

    // translation
    TranslateModule.forRoot({
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    // web components
    WebComponentsModule,

    // gallery module
    ModalGalleryModule.forRoot()
  ],
  providers: [
    RepositoryClientProvider,
     {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    }
  ],
  exports: [
    WebComponentsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
