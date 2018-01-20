import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UrlConfig } from '../../../config/url.config';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-login-form',
    templateUrl: 'login-form.component.html'
})
export class LoginFormComponent extends BaseModuleComponent implements OnInit, OnChanges {

    @Input() fixedEmail: string;

    /**
     * This is created because the fixed e-mail can be provided at a later time. This should be set
     * immediately so that the field is also disabled immediately
     */
    @Input() isSessionLock: boolean = false;

    public readonly emailLength: number = 50;

    public email = new FormControl('', [Validators.required, Validators.email]);
    public password = new FormControl('', [Validators.required]);

    public formGroup = new FormGroup({
        email: this.email,
        password: this.password,
    });

    public loginFailed: boolean = false;

    public missingLogonDetails: boolean = false;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();

        // subscribe to changes in fragment (hash) because AuthService will redirect back to this page
        // with random fragment to ensure that the page can reload its data
        this.activatedRoute.fragment
            .takeUntil(this.ngUnsubscribe)
            .subscribe((fragment: string) => {
                this.processFailedLogonRedirect();
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isSessionLock) {
            // set disabled field if e-mail is forced
            this.email.disable();
        }   

        if (this.fixedEmail) {
            this.email.setValue(this.fixedEmail);
        }
    }


    private processFailedLogonRedirect() {
        const result = this.activatedRoute.snapshot.queryParams['loginResult'];

        // auth service will redirect back to logon page with query param 'result=error' and radnom fragment (hash) if login fails
        if (result === 'externalFail') {
            this.loginFailed = true;
        } else {
            this.loginFailed = false;
        }

        // hide loader now
        this.stopGlobalLoader();
    }

    // event emitters
    onLogin(): void {
        if (!this.password.value || !this.email.value) {
            this.missingLogonDetails = true;
            return;
        }

        this.resetErrors();
        this.startGlobalLoader();

        this.dependencies.coreServices.authService.login(this.email.value, this.password.value, callback => {
            if (!callback.isSuccessful) {
                this.loginFailed = true;
            } else {
                // redirect user to entry page
                this.dependencies.coreServices.navigateService.entryPage().navigate();
            }
        });
    }

    onLogout() {
        this.startGlobalLoader();
        this.dependencies.coreServices.authService.logout();
    }

    loginWithGoogle() {
        this.resetErrors();
        this.startGlobalLoader();
        this.dependencies.coreServices.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.resetErrors();
        this.startGlobalLoader();
        this.dependencies.coreServices.authService.loginWithFacebook();
    }

    getRegisterUrl(): string {
        return super.getAuthUrl(UrlConfig.Register);
    }

    getResetPasswordUrl(): string {
        return super.getAuthUrl(UrlConfig.ResetPassword);
    }

    getLoginUr(): string {
        return this.dependencies.coreServices.navigateService.loginPage().getUrl();
    }

    getEmailError() {
        return this.email.hasError('required') ? 'required' :
            this.email.hasError('email') ? 'invalidEmail' :
                '';
    }

    getPasswordError() {
        return this.password.hasError('required') ? 'required' : '';
    }

    private resetErrors(): void {
        this.loginFailed = false;
        this.missingLogonDetails = false;
    }
}
