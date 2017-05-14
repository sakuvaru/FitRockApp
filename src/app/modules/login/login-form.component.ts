// common
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/dynamic-form/base-field.class';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component

@Component({
    selector: 'login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent extends BaseComponent {

    // event outputs
    @Output() onLoginFailedEvent = new EventEmitter();
    @Output() onLoginEvent = new EventEmitter();
    @Output() onLogoutEvent = new EventEmitter();

    // properties
    private username: string;
    private password: string;

    private loginFailed: boolean;

    constructor(protected dependencies: ComponentDependencyService) {
        super(dependencies)
        {

        // subscribe to changes in fragment (hash) because AuthService will redirect back to this page
        // with random fragment to ensure that the page can reload its data
        this.dependencies.activatedRoute.fragment.subscribe((fragment: string) => {
            this.processFailedLogonRedirect()
            });
        }
    }

    initAppData(): AppData {
        return new AppData("Login");
    }

    private processFailedLogonRedirect() {
        var result = this.dependencies.activatedRoute.queryParams['result'];

        // auth service will redirect back to logon page with query param 'result=error' and radnom fragment (hash) if login fails
        if (result === 'error') {
            this.loginFailed = true;
            this.onLoginFailedEvent.emit();
        }
        else {
            this.loginFailed = false;
        }

        // hide loader now
        this.resolveLoader();
    }

    // event methods
    onLogin() {
        this.registerLoader();
        this.onLoginEvent.emit();
        var success = this.dependencies.authService.authenticate(this.username, this.password);
    }

    onLogout() {
        this.registerLoader();
        this.onLogoutEvent.emit();
        this.dependencies.authService.logout();
    }

    loginWithGoogle() {
        this.registerLoader();
        this.onLoginEvent.emit();
        this.dependencies.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.registerLoader();
        this.onLoginEvent.emit();
        this.dependencies.authService.loginWithFacebook();
    }
}