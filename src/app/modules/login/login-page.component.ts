// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        // go to dashboard if user is already logged
        if (this.dependencies.authService.isAuthenticated()) {
            this.dependencies.router.navigate([UrlConfig.getTrainerUrl(null)]);
        }
    }

     initAppData(): AppData {
        return new AppData({
            subTitle: "Přihlášení"
        });
    }
}