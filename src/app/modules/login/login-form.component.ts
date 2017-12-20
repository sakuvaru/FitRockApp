import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlConfig } from '../../config/url.config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    selector: 'login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent extends BaseComponent implements OnInit {

    // event outputs
    @Output() onLoginFailedEvent = new EventEmitter();
    @Output() onLoginEvent = new EventEmitter();
    @Output() onLogoutEvent = new EventEmitter();

    public email = new FormControl('', [Validators.required, Validators.email]);
    public password = new FormControl('', [Validators.required]);

    public formGroup = new FormGroup({
        email: this.email,
        password: this.password,
    });

    public loginFailed: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit() {
        super.ngOnInit();

        // subscribe to changes in fragment (hash) because AuthService will redirect back to this page
        // with random fragment to ensure that the page can reload its data
        this.activatedRoute.fragment
            .takeUntil(this.ngUnsubscribe)
            .subscribe((fragment: string) => {
                this.processFailedLogonRedirect();
            },
            error => super.handleAppError(error));
    }

    private processFailedLogonRedirect() {
        const result = this.activatedRoute.snapshot.queryParams['result'];

        // auth service will redirect back to logon page with query param 'result=error' and radnom fragment (hash) if login fails
        if (result === 'error') {
            this.loginFailed = true;
            this.onLoginFailedEvent.emit();
        } else {
            this.loginFailed = false;
        }

        // hide loader now
        this.stopGlobalLoader();
    }

    // event emitters
    onLogin() {
        this.resetErrors();
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        this.dependencies.coreServices.authService.authenticate(this.email.value, this.password.value);
    }

    onLogout() {
        this.startGlobalLoader();
        this.onLogoutEvent.emit();
        this.dependencies.coreServices.authService.logout();
    }

    loginWithGoogle() {
        this.resetErrors();
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        this.dependencies.coreServices.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.resetErrors();
        this.startGlobalLoader();
        this.onLoginEvent.emit();
        this.dependencies.coreServices.authService.loginWithFacebook();
    }

    getRegisterUrl(): string {
        return super.getAuthUrl(UrlConfig.Register);
    }

    getEmailError() {
        return this.email.hasError('required') ? 'missingValue' :
            this.email.hasError('email') ? 'invalidEmail' :
                '';
    }

    getPasswordError() {
        return this.password.hasError('required') ? 'required' : '';
    }

    private resetErrors(): void {
        this.loginFailed = false;
    }
}
