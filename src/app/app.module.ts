// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// authentication
import { AuthModule } from './auth/auth.module';

// main components
import { HeaderComponent } from './modules/shared/header.component';
import { FooterComponent } from './modules/shared/footer.component';
import { NotFoundComponent } from './modules/shared/not-found.component';
import { UnauthorizedComponent } from './modules/shared/unauthorized.component';

// main app
import { AppComponent } from './app.component';

// custom modules
import { RepositoryModule } from './repository/repository.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginModule } from './modules/login/login.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    // route config
       RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/dash', pathMatch: 'full'
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]),

    // authentication
    AuthModule,

    // default modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // custom modules
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
