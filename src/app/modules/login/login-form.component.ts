import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

// auth0 class exposed by auth0 js

@Component({
    selector: 'login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent {

    // event outputs
    @Output() onLoginEvent = new EventEmitter<boolean>();
    @Output() onLogoutEvent = new EventEmitter();

    // properties
    private username: string;
    private password: string;

    constructor(private authService: AuthService, private router: Router) { }

    // event methods
    onSubmit() {
        var success = this.authService.authenticate(this.username, this.password);

        if (success) {
            // user was logged in
            this.onLoginEvent.emit(true);
        }
        else {
            // authentication failed
            this.onLoginEvent.emit(false);
        }
    }

    onLogout() {
        this.authService.logout();
        this.onLogoutEvent.emit();
    }

    onLoginWithGoogle() {
        this.authService.loginWithGoogle();
    }
}