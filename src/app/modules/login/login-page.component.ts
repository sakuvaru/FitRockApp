import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppConfig } from '../../core/config/app.config';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent {

    constructor(private router: Router, private authService: AuthService) { 
        // go to dashboard if user is already logged
        if (this.authService.isAuthenticated()){
            this.router.navigate([AppConfig.DashboardPath]);
        }
    }

    private handleLogin(isAuthenticated: boolean) {
        if (isAuthenticated) {
            this.router.navigate([AppConfig.DashboardPath]);
        }
        else {
            console.log("Login failed");
        }
    }

    private handleLogout() {
        console.log("You logged out");
    }
}