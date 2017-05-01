// default/angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// main components
import { HeaderComponent } from './modules/shared/header.component';
import { FooterComponent } from './modules/shared/footer.component';
import { NotFoundComponent } from './modules/shared/not-found.component';

// main app
import { AppComponent } from './app.component';

// custom modules
import { RepositoryModule } from './services/repository/repository.module';
import { ServicesModule } from './services/services.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent
  ],
  imports: [
    // route config
       RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/dash', pathMatch: 'full'
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]),

    // default modules
    BrowserModule,
    FormsModule,
    HttpModule,

    // custom modules
    DashboardModule,
    RepositoryModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
