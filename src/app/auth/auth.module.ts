import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(
    new AuthConfig({
      tokenName: AppConfig.TokenName, // name of the local storage under which JWT token is stored
      noJwtError: AppConfig.NoJwtError // prevents auth HTTP from throwing exceptions if JWT token is not present & sends anonymous requests instead
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService,
    TokenService
  ]
})
export class AuthModule {}