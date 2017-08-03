import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { AppConfig } from '../../app/core/config/app.config';
import { UrlConfig } from '../../app/core/config/url.config';
import { Auth0ErrorResponse } from './models/auth0-error-response.class';
import { CurrentUser } from './models/current-user.class';
import { Router } from '@angular/router';
import { Guid } from '../../lib/utilities';

// auth0 class exposed by auth0 js
declare var auth0: any;

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
    private auth0 = new auth0.WebAuth({
        domain: AppConfig.Auth0_Domain,
        clientID: AppConfig.Auth0_ClientId,
        redirectUri: AppConfig.Auth0_RedirectUri,
        responseType: AppConfig.Auth0_ResponseType,
        scope: AppConfig.Auth0_Scope
    });

    private jwtHelper = new JwtHelper();

    constructor(private tokenService: TokenService, private http: Http, private router: Router) {
    }

    private handleAuthenticationError(response: Auth0ErrorResponse): boolean {
        if (response == null) {
            throw Error("Response from Auth0 is missing");
        }

        // log error
        console.error(response.description);

        // redirect back to logon page & add a random hash (hash needs to be added to URL for lifecycle check)
        this.router.navigate([UrlConfig.getLoginUrl()], { queryParams: { result: "error" }, fragment: Guid.newGuid() })

        return false;
    }

    public getCurrentUser(): CurrentUser | null{
        if (!this.isAuthenticated()) {
            return new CurrentUser(false)
        }

        var idToken = this.tokenService.getIdToken();
        if (!idToken){
            console.warn('IdToken could not be retrieved from local storage')
            return null;
        }

        var decodedToken = this.jwtHelper.decodeToken(idToken);

        return new CurrentUser(true, decodedToken["email"], decodedToken["nickname"]);
    }

    public authenticate(username: string, password: string): boolean {
        this.auth0.redirect.loginWithCredentials({
            connection: AppConfig.Auth0_UserPasswordConnectionName,
            username,
            password
        }, errorResponse => {
            if (errorResponse) {
                this.handleAuthenticationError(errorResponse as Auth0ErrorResponse);
                return errorResponse;
            }
            return errorResponse;
        });

        return true;
    }

    public handleAuthentication(): void {
        this.auth0.parseHash({ _idTokenVerification: false }, (err, authResult) => {
            if (err) {
                this.handleAuthenticationError(err);
            }
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.tokenService.setAccessToken(authResult.accessToken);
                this.tokenService.setIdToken(authResult.idToken);
            }
        });
    }

    public loginWithGoogle(): void {
        this.auth0.authorize({
            connection: AppConfig.Auth0_GoogleConnectionName,
        });
    }

    public loginWithFacebook(): void {
        this.auth0.authorize({
            connection: AppConfig.Auth0_FacebookConnectionName,
        });
    }

    public logout(): void {
        // to logout simply remove tokens
        this.tokenService.removeAccessToken();
        this.tokenService.removeIdToken();
    }

    public isAuthenticated(): boolean {
        var idToken = this.tokenService.getIdToken();

        if (!idToken) {
            // missing token - not authenticated
            return false;
        }

        if (this.jwtHelper.isTokenExpired(idToken)) {
            // token is not valid or expired
            return false;
        }

        return true;
    }
}