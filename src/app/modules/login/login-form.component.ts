// common
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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

    constructor(protected dependencies: ComponentDependencyService) { super(dependencies) 
        // process failed attempts
        this.dependencies.activatedRoute
            .queryParams
            .subscribe(params => {
                this.processLogonResponse(params['result']);
            });

        this.processLogonResponse(this.dependencies.activatedRoute.queryParams['result']);
    }

     initAppData(): AppData {
        return new AppData("Login");
    }

    private processLogonResponse(result: string) {
        this.resolveLoader();
        // auth service will redirect back to logon page with query param 'result=error' if login fails
        if (result === 'error'){
            this.loginFailed = true;
            this.onLoginFailedEvent.emit();
            // remove 'result' query param from URL so that subsequent login attempts are processed
            this.dependencies.router.navigate([AppConfig.PublicPath + '/' + AppConfig.LoginPath]);
        }
        else{
            this.loginFailed = false;
        }
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