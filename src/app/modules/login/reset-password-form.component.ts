import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UrlConfig } from '../../config/url.config';
import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    selector: 'reset-password-form',
    templateUrl: 'reset-password-form.component.html'
})
export class ResetPasswordFormComponent extends BasePageComponent implements OnInit {

    public readonly emailLength: number = 50;

    public email = new FormControl('', [Validators.required, Validators.email]);

    public formGroup = new FormGroup({
        email: this.email
    });

    public resetPasswordFailed: boolean = false;

    public missingEmail: boolean = false;

    public resetPasswordEmailSend: boolean = false;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: true
        });
    }

    ngOnInit() {
        super.ngOnInit();
    }

    onResetPassword() {
        if (!this.email.value) {
            this.missingEmail = true;
            return;
        }

        this.resetErrors();
        this.startGlobalLoader();
        super.subscribeToObservable(this.dependencies.itemServices.userService.resetPassword(this.email.value)
            .map(response => {
                // this response means reset password was send
                this.processSuccessResetPassword();
            }));
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

    getEmailError() {
        return this.email.hasError('required') ? 'required' :
            this.email.hasError('email') ? 'invalidEmail' :
                '';
    }

    getLoginUrl(): string {
        return super.getAuthUrl(UrlConfig.Login);
    }

    private processSuccessResetPassword(): void {
        this.resetPasswordEmailSend = true;
        this.email.setValue('');
    }

    private resetErrors(): void {
        this.resetPasswordFailed = false;
        this.missingEmail = false;
        this.resetPasswordEmailSend = false;
    }
}
