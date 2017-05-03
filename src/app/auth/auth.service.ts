import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { AuthTypeEnum } from './auth-type.enum';
import { Http } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { Auth0StandardRequestBody } from './models/auth0-standard-request-body.class';

@Injectable()
export class AuthService {

    private jwtHelper = new JwtHelper();

    constructor(private tokenService: TokenService, private http: Http) {
    }

    private getAuth0StandardRequestBody(username: string, password: string): Auth0StandardRequestBody {
        return new Auth0StandardRequestBody(
            AppConfig.ClientId,
            username,
            password
        );
    }

    private validateAuth0Response(response: any): boolean{
        console.log("validatoin");
        console.log(response);
        return true;
    }

    authenticate(username: string, password: string, type: AuthTypeEnum): boolean {
        if (type === AuthTypeEnum.auth0_standard) {
            // send request ang get JWT token
            this.http.post(
                AppConfig.Auth0Endpoint,
                this.getAuth0StandardRequestBody(username, password),
            ).toPromise().then(response => this.validateAuth0Response(response));

            var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inlhem9vQGVtYWlsLmN6IiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX2lkIjoiYXV0aDB8NThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwiY2xpZW50SUQiOiJ4TDhyVUxoMlNSeU52cmtJb0JweVNhcVV4eU1IRHlJMiIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9mZjdlNTA4MzdiOGYyODZiODAyODU2YzdlZDkxYTkyNz9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnlhLnBuZyIsIm5pY2tuYW1lIjoieWF6b28iLCJpZGVudGl0aWVzIjpbeyJ1c2VyX2lkIjoiNThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwicHJvdmlkZXIiOiJhdXRoMCIsImNvbm5lY3Rpb24iOiJVc2VybmFtZS1QYXNzd29yZC1BdXRoZW50aWNhdGlvbiIsImlzU29jaWFsIjpmYWxzZX1dLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNS0wM1QxNzozMDo0Ny4yMzRaIiwiY3JlYXRlZF9hdCI6IjIwMTctMDQtMDJUMDk6MTk6MzUuODE4WiIsIm5hbWUiOiJ5YXpvb0BlbWFpbC5jeiIsImlzcyI6Imh0dHBzOi8vZml0cm9jay5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NThlMGMyMjc3ZTg5YTQwMjcwZmYxYWExIiwiYXVkIjoieEw4clVMaDJTUnlOdnJrSW9CcHlTYXFVeHlNSER5STIiLCJleHAiOjE0OTM4Njg2NDcsImlhdCI6MTQ5MzgzMjY0N30.B0uRlx4KAxtnZDssac24Mjw-GFx7OVnngU1BzsxxCz0";

            // check if token is valid/expired
            if (this.jwtHelper.isTokenExpired(token)) {
                throw new Error("Your session has expired, please log-in again");
            }

            // save JWT token
            this.tokenService.setToken(token);

            return true;
        }
        else {
            throw new Error('Unsupported authentication type "' + type + '"');
        }
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