import { Injectable } from '@angular/core';
import { AppConfig } from '../core/config/app.config';

@Injectable()
export class TokenService {

    private accessTokenName = AppConfig.Auth0_AccessTokenStorageName;
    private idTokenName = AppConfig.Auth0_IdTokenStorageName;

    constructor() { }

    getAccessToken(): string {
        return localStorage.getItem(this.accessTokenName);
    }

    setAccessToken(token: string): void {
        localStorage.setItem(this.accessTokenName, token);
    }

    removeAccessToken(): void{
        localStorage.removeItem(this.accessTokenName);
    }

    
    getIdToken(): string {
        return localStorage.getItem(this.idTokenName);
    }

    setIdToken(token: string): void {
        localStorage.setItem(this.idTokenName, token);
    }

    removeIdToken(): void{
        localStorage.removeItem(this.idTokenName);
    }
}