// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// authentication
import { AuthModule } from './auth/auth.module';

// main app
import { AppComponent } from './app.component';

// custom modules
import { SharedModule } from './modules/shared/shared.module';
import { RepositoryModule } from './repository/repository.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';
import { AppConfig } from './core/config/app.config';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // route config
       RouterModule.forRoot([
      {
        path: '',
        redirectTo: AppConfig.DashboardPath, pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: "/" + AppConfig.NotFoundPath
      }
    ]),

    // authentication
    AuthModule,

    // default modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // custom modules
    SharedModule,
    DashboardModule,
    RepositoryModule,
    ServicesModule,
    LoginModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
