import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';

@NgModule({
  providers: [
    AuthService,
    TokenService,
    AuthGuardService
  ]
})
export class AuthModule {}
