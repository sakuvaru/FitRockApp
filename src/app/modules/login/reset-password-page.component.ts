import { Component } from '@angular/core';

import { UrlConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    templateUrl: 'reset-password-page.component.html'
})
export class ResetPasswordPageComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // redirect to entry url if user is already logged
        if (this.dependencies.coreServices.authService.isAuthenticated()) {
            this.dependencies.router.navigate([UrlConfig.getEntryUrl()]);
        }
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }
}
