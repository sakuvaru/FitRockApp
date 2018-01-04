import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigateService } from 'app/core/services';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private navigateService: NavigateService) { }

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            this.navigateService.unauthorizedPage();
            return false;
        }
    }
}
