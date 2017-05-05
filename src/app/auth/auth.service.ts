import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthTypeEnum } from './auth-type.enum';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { Auth0StandardRequest } from './models/auth0-standard-request.class';
import { Auth0ErrorResponse } from './models/auth0-error-response.class';

@Injectable()
export class AuthService {

    private jwtHelper = new JwtHelper();

    constructor(private tokenService: TokenService, private http: Http) {
    }

    private getAuth0StandardRequestBody(username: string, password: string): Auth0StandardRequest {
        return new Auth0StandardRequest(
            AppConfig.ClientId,
            username,
            password
        );
    }

    private handleAuthenticationError(response: Auth0ErrorResponse): boolean{
        if (response == null){
            throw Error("Response from Auth0 is missing");
        }

        // log error
        console.log(response.error_description);

        return false;
    }

    private handleAuthenticationRespose(response: Auth0StandardRequest): boolean{
            if (response == null){
                throw Error("Invalid response from Auth0");
            }

            // check if token is valid/expired
            if (this.jwtHelper.isTokenExpired(response.id_token)) {
                throw new Error('Your session has expired, please log-in again');
            }

            // save JWT token
            this.tokenService.setToken(response.id_token);

            return true;
    }

    authenticate(username: string, password: string, type: AuthTypeEnum): Promise<boolean> {
        if (type === AuthTypeEnum.auth0_standard) {
            // send request ang get JWT token
            return this.http.post(
                AppConfig.Auth0Endpoint,
                this.getAuth0StandardRequestBody(username, password),
            ).toPromise()
                .then(response => this.handleAuthenticationRespose(response.json() as Auth0StandardRequest))
                .catch(response => this.handleAuthenticationError(response.json() as Auth0ErrorResponse));
        }
        else {
            throw new Error('Unsupported authentication type "' + type + '"');
        }
    }

    logout(): void{
        // for log-out simply remove token from local storage
        this.tokenService.removeToken();
    }

    isAuthenticated(): boolean {
        if (!this.tokenService.getToken()) {
            // missing token - not authenticated
            return false;
        }

        if (this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
            // token is not valid or expired
            return false;
        }

        return true;
    }
}