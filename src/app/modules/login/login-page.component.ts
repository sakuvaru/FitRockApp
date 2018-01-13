import { Component } from '@angular/core';

import { UrlConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // redirect to entry url if user is already logged
        if (this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.coreServices.navigateService.entryPage().navigate();
        }
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }
}
