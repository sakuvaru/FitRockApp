import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../../app/core/config/app.config';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { authHttpServiceFactory } from './auth-http-service.provider';

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService,
    TokenService,
    AuthGuardService
  ]
})
export class AuthModule {}
