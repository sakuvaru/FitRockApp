// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LogoutComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        // logout user
        this.dependencies.authService.logout();

        // redirect after logging-out
        this.dependencies.router.navigate([UrlConfig.getPublicUrl(UrlConfig.Logout)]);
    }
}