import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import * as jwtDecode from 'jwt-decode';
import * as Auth0 from 'auth0-js';
import { Auth0User } from 'lib/auth/models/auth0-user.class';

import { AppConfig } from '../../app/config';
import { Auth0LoginCallback } from './models/auth0-login-callback.class';
import { TokenService } from './token.service';
import { LogStatus } from './models/log-status.enum';

/*
Authentication service requirements:
Auth0 js library: https://github.com/auth0/auth0.js
Documentation info: https://auth0.com/docs/quickstart/spa/angular2/02-custom-login

In order for auth service to work, the id_token needs to be extraced from URL (hash) after being redirected
from login provided (google, facebook, auth0..). Therefore the 'handleAuthentication' method
can be called in 'app.component.ts' (all requests) or in a specific callback page for this purpose
*/
@Injectable()
export class AuthService {

    // Configure Auth0
    private auth0 = new Auth0.WebAuth({
        domain: AppConfig.Auth0_Domain,
        clientID: AppConfig.Auth0_ClientId,
        redirectUri: AppConfig.Auth0_RedirectUri,
        responseType: AppConfig.Auth0_ResponseType,
        scope: AppConfig.Auth0_Scope
    });

    constructor(private tokenService: TokenService, private http: Http, private router: Router) { 
    }

    getCurrentAuthUser(): Auth0User | null {
        const status = this.getAuthenticationStatus();

        if (status === LogStatus.MissingToken) {
            return null;
        }

        const idToken = this.tokenService.getIdToken();
        if (!idToken) {
            console.warn('IdToken could not be retrieved from local storage');
            return null;
        }

        const decodedToken = this.decodeToken(idToken);

        return new Auth0User(
            status,
            decodedToken['email_verified'], 
            decodedToken['picture'], 
            decodedToken['email'], 
            decodedToken['nickname'],
            decodedToken['given_name'],
            decodedToken['family_name'],
            decodedToken['gender'] === 'female' ? true : false,
        );
    }

    login(username: string, password: string, callback: (result: Auth0LoginCallback) => void): void {
        this.auth0.client.login( {
            realm: AppConfig.Auth0_UserPasswordConnectionName,
            username: username,
            password: password 
        }, (error, authResult) => {
            
            let isSuccessful: boolean = false;
            let token: string | null = null;

            if (error) {
                isSuccessful = false;
            }

            if (!authResult) {
                isSuccessful = false;
            }
            
            if (authResult && authResult.idToken) {
                token = authResult.idToken;
                if (token) {
                    this.tokenService.setIdToken(token);
                    isSuccessful = true;
                }
            }

            callback(new Auth0LoginCallback(error, isSuccessful, token));
        });
    }

    handleExternalAuthentication(callback: (result: Auth0LoginCallback) => void): void {
        this.auth0.parseHash({ _idTokenVerification: false }, (error, authResult) => {
            let isSuccessful: boolean = false;
            let token: string | null = null;

            if (error) {
                isSuccessful = false;
            }

            if (!authResult) {
                isSuccessful = false;
            }
            
            if (authResult && authResult.idToken) {
                token = authResult.idToken;
                if (token) {
                    this.tokenService.setIdToken(token);
                    isSuccessful = true;
                }
            }

            callback(new Auth0LoginCallback(error, isSuccessful, token));
        });
    }

    loginWithGoogle(): void {
        this.auth0.authorize({
            connection: AppConfig.Auth0_GoogleConnectionName,
        });
    }

    loginWithFacebook(): void {
        this.auth0.authorize({
            connection: AppConfig.Auth0_FacebookConnectionName,
        });
    }

    logout(): void {
        // to logout simply remove tokens
        this.tokenService.removeAccessToken();
        this.tokenService.removeIdToken();
    }

    getAuthenticationStatus(): LogStatus {
        const idToken = this.tokenService.getIdToken();

        if (!idToken) {
            // missing token - not authenticated
            return LogStatus.MissingToken;
        }

        if (this.isTokenExpired(idToken)) {
            // token is expired
            return LogStatus.TokenExpired;
        }

        return LogStatus.Authenticated;
    }

    private decodeToken(token: string): any {
        return jwtDecode(token);
    }

    private isTokenExpired(token: string): boolean {
        const current_time = Date.now().valueOf() / 1000; // why value of? -> https://github.com/auth0/jwt-decode/issues/53
        const decodedToken = this.decodeToken(token);

        if (!decodedToken) {
            return true;
        }

        if ( decodedToken.exp < current_time) {
            return true;
        }

        return false;
    }
}


