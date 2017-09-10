import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AppConfig } from '../../app/core/config/app.config';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(
      new AuthConfig({
        tokenName: AppConfig.Auth0_IdTokenStorageName, // name of the local storage under which JWT token is stored
        noJwtError: AppConfig.Auth0_NoJwtError // prevents auth HTTP from throwing exceptions if JWT token is not present & sends anonymous requests instead
    }), http, options);
  }