// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';

// Auth redirect component
import { EntryComponent } from './entry.component';

// required by material angular + gallery
// Info: https://material.angular.io/guide/getting-started and https://ks89.github.io/angular-modal-gallery.github.io/gettingStarted
import 'hammerjs';

// required by gallery
// Info: https://ks89.github.io/angular-modal-gallery.github.io/gettingStarted
import 'mousetrap';
import { ModalGalleryModule } from 'angular-modal-gallery';

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
import { AppConfig, UrlConfig } from './config';

// web components
import { WebComponentsModule } from '../web-components';

// localization
import { AppLanguageResolver } from '../app/core/providers/app-language-resolver';
import { LocalizationModule, LanguageResolver } from '../lib/localization';

// calendar
import { CalendarModule as AngularCalendarModule } from 'angular-calendar';

// google map
import { AgmCoreModule } from '@agm/core';

// core module
import { CoreModule } from './core';

// web component services
import { WebComponentServicesModule } from './web-component-services/web-component-services.module';

// modules
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
import { LocationModule } from './modules/locations/location.module';

@NgModule({
  declarations: [
    AppComponent,
    Global404Component,
    EntryComponent
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
        redirectTo: UrlConfig.EntryPath, pathMatch: 'full'
      },
      {
        path: UrlConfig.EntryPath,
        component: EntryComponent
      },
      {
        path: '**',
        redirectTo: UrlConfig.Global404
      }
    ]),

    // authentication
    AuthModule,

    // web component services
    WebComponentServicesModule,

    // modules
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
    LocationModule,

    // localization
    LocalizationModule.forRoot({
      languageResolver: { provide: LanguageResolver, useClass: AppLanguageResolver }
    }),

    // calendar
    AngularCalendarModule.forRoot(),

    // web components
    WebComponentsModule,

    // gallery module
    ModalGalleryModule.forRoot(),

    // google map module
    AgmCoreModule.forRoot({
      apiKey: AppConfig.GoogleApiKey
    })
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
