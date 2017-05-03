import { Injectable } from '@angular/core';
import { AppConfig } from '../core/config/app.config';

@Injectable()
export class TokenService {

    private tokenName = AppConfig.TokenName;

    constructor() { }

    getToken(): string {
        return localStorage.getItem(this.tokenName);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenName, token);
    }
}