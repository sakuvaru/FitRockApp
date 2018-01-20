import { Component } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
    templateUrl: 'logout-page.component.html'
})
export class LogoutPageComponent extends BasePageComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // logout user
        this.dependencies.coreServices.authService.logout();

        // redirect after logging-out
        this.dependencies.coreServices.navigateService.logoutPage().navigate();
    }
}
