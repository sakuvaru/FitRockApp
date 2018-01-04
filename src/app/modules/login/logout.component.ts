// common
import { Component } from '@angular/core';

import { UrlConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LogoutComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // logout user
        this.dependencies.coreServices.authService.logout();

        // redirect after logging-out
        this.dependencies.coreServices.navigateService.logoutPage();
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: false,
            isNested: false
        });
    }
}
