import { Observable } from 'rxjs/Rx';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { UrlConfig } from 'app/config';

@Component({
    selector: 'register-form',
    templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent extends BaseComponent implements OnInit {

    private readonly passwordMismatchError: string = 'passwordMismatch';
    private readonly customError: string = 'customError';

    public email = new FormControl('', [Validators.required, Validators.email]);
    public password = new FormControl('', [Validators.required]);
    public passwordConfirm = new FormControl('', [Validators.required]);

    public formGroup = new FormGroup({
        email: this.email,
        password: this.password,
        passwordConfirm: this.passwordConfirm
    });

    public registerError: boolean = false;

    public mismatchPasswordError: boolean = false;

    constructor(
        protected dependencies: ComponentDependencyService
    ) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
    }

    ngOnInit() {
        super.ngOnInit();

        const passwordMismatchError: any = {};
        passwordMismatchError[this.customError] = this.passwordMismatchError;

        const removeMismatchError: any = {};

        this.password.valueChanges
            .takeUntil(this.ngUnsubscribe)
            .subscribe(value => {
                if ((value !== this.passwordConfirm.value) && this.password.value && this.passwordConfirm.value) {
                    this.mismatchPasswordError = true;
                } else {
                    this.mismatchPasswordError = false;
                }
            });

        this.passwordConfirm.valueChanges
            .takeUntil(this.ngUnsubscribe)
            .subscribe(value => {
                if ((value !== this.password.value) && this.password.value && this.passwordConfirm.value) {
                    this.mismatchPasswordError = true;
                } else {
                    this.mismatchPasswordError = false;
                }
            });
    }

    onRegister(): void {
        super.subscribeToObservable(
            this.dependencies.itemServices.userService.createAccount(this.email.value, this.password.value)
                .catch(error => {
                    console.warn('Registration failed');
                    this.registerError = true;

                    return Observable.of(error);
                })
        );
    }

    getLoginUrl(): string {
        return super.getAuthUrl(UrlConfig.Login);
    }

    loginWithGoogle() {
        super.startGlobalLoader();
        this.dependencies.coreServices.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        super.startGlobalLoader();
        this.dependencies.coreServices.authService.loginWithFacebook();
    }

    getEmailError() {
        return this.email.hasError('required') ? 'required' :
            this.email.hasError('email') ? 'invalidEmail' :
                '';
    }

    getPasswordError() {
        return this.password.hasError('required') ? 'required' : '';
    }

    getPasswordConfirmError() {
        return this.passwordConfirm.hasError('required') ? 'required' : '';
    }
}

