// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // go to dashboard if user is already logged
        if (this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.router.navigate([UrlConfig.getTrainerUrl('')]);
        }
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }
}
