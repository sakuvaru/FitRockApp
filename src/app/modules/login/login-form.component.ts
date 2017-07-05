// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

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
    }

    ngOnInit() {
        super.ngOnInit();

        // subscribe to changes in fragment (hash) because AuthService will redirect back to this page
        // with random fragment to ensure that the page can reload its data
        this.activatedRoute.fragment
            .takeUntil(this.ngUnsubscribe)
            .subscribe((fragment: string) => {
                this.processFailedLogonRedirect()
            });
    }

    private processFailedLogonRedirect() {
        var result = this.activatedRoute.snapshot.queryParams['result'];

        // auth service will redirect back to logon page with query param 'result=error' and radnom fragment (hash) if login fails
        if (result === 'error') {
            this.loginFailed = true;
            this.onLoginFailedEvent.emit();
        }
        else {
            this.loginFailed = false;
        }

        // hide loader now
        this.stopGlobalLoader();
    }

    // event emitters
    onLogin() {
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        var success = this.dependencies.coreServices.authService.authenticate(this.username, this.password);
    }

    onLogout() {
        this.startGlobalLoader();
        this.onLogoutEvent.emit();
        this.dependencies.coreServices.authService.logout();
    }

    loginWithGoogle() {
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        this.dependencies.coreServices.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        this.dependencies.coreServices.authService.loginWithFacebook();
    }
}