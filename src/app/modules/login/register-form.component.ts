import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UrlConfig } from 'app/config';
import { AuthErrorResponse } from 'lib/repository';
import { Observable } from 'rxjs/Rx';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    selector: 'register-form',
    templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent extends BasePageComponent implements OnInit {

    public readonly emailLength: number = 50;

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

    public loginFailed: boolean = false;

    public registerError: boolean = false;

    public userAlreadyExistsError: boolean = false;

    public mismatchPasswordError: boolean = false;

    constructor(
        protected dependencies: ComponentDependencyService
    ) {
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
        this.resetErrors();

        super.subscribeToObservable(
            this.dependencies.itemServices.userService.createAccount(this.email.value, this.password.value)
                .map((response) => {
                    this.handleRegistrationSuccess();
                })
                .catch(error => {
                    console.warn('Registration failed');
                    if (error instanceof AuthErrorResponse) {
                        // get error type
                        const errorType = error.authError;
                       
                        if (errorType === 0) {
                            // user already exists error
                            this.userAlreadyExistsError = true;
                        } else {
                            this.registerError = true;
                        }
                    } else {
                        this.registerError = true;
                    }

                    return Observable.of(error);
                })
        );
    }

    getLoginUrl(): string {
        return super.getAuthUrl(UrlConfig.Login);
    }

    loginWithGoogle() {
        this.resetErrors();
        super.startGlobalLoader();
        this.dependencies.coreServices.authService.loginWithGoogle();
    }

    loginWithFacebook() {
        this.resetErrors();
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

    /**
     * Called whe registration was successful
     */
    private handleRegistrationSuccess(): void {
        // try authentication user right away after registration
        this.dependencies.coreServices.authService.login(this.email.value, this.password.value, callback => {
            if (!callback.isSuccessful) {
                this.loginFailed = true;
            } else {
                // redirect user to entry page
                this.dependencies.coreServices.navigateService.entryPage().navigate();
            }
        });
    }

    private resetErrors(): void {
        this.registerError = false;
        this.userAlreadyExistsError = false;
    }
}

