import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { UrlConfig } from '../../app/config';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate([UrlConfig.getUnAuthorizedUrl()]);
            return false;
        }
    }
}
