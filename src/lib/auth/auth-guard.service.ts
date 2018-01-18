import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigateService } from 'app/core/services';

import { AuthService } from './auth.service';
import { LogStatus } from './models/log-status.enum';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private navigateService: NavigateService) { }

    canActivate(): boolean {
        const status = this.authService.getAuthenticationStatus();
        if (status === LogStatus.Authenticated) {
            return true;
        } else {
            if (status === LogStatus.TokenExpired) {
                this.navigateService.sessionLockPage().navigate();
            } else {
                this.navigateService.unauthorizedPage().navigate();
            }
            return false;
        }
    }
}
