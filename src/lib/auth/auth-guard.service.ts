import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavigateService } from 'app/core/services';

import { AuthService } from './auth.service';
import { LogStatus } from './models/log-status.enum';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private navigateService: NavigateService) { }

    canActivate(): boolean {
        if (this.authService.getAuthenticationStatus() === LogStatus.Authenticated) {
            return true;
        } else {
            this.navigateService.unauthorizedPage().navigate();
            return false;
        }
    }
}
