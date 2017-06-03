// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
        {

        // subscribe to changes in fragment (hash) because AuthService will redirect back to this page
        // with random fragment to ensure that the page can reload its data
        this.activatedRoute.fragment.subscribe((fragment: string) => {
            this.processFailedLogonRedirect()
            });
        }
    }

     initAppData(): AppData {
        return new AppData();
    }

    private processFailedLogonRedirect() {
        var result = this.activatedRoute.queryParams['result'];

        // auth service will redirect back to logon page with query param 'result=error' and radnom fragment (hash) if login fails
        if (result === 'error') {
            this.loginFailed = true;
            this.onLoginFailedEvent.emit();
        }
        else {
            this.loginFailed = false;
        }

        // hide loader now
        this.resolveFullScreenLoader();
    }

    // event emitters
    onLogin() {
        this.registerFullScreenLoader();
        this.onLoginEvent.emit();
        var success = this.dependencies.authService.authenticate(this.username, this.password);
    }

    onLogout() {
        this.registerFullScreenLoader();
        this.onLogoutEvent.emit();
        this.dependencies.authService.logout();
    }

    loginWithGoogle() {
        this.registerFullScreenLoader();
        this.onLoginEvent.emit();
        this.dependencies.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.registerFullScreenLoader();
        this.onLoginEvent.emit();
        this.dependencies.authService.loginWithFacebook();
    }
}