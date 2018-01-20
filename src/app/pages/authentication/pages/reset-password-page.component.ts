import { Component } from '@angular/core';

import { LogStatus } from '../../../../lib/auth';
import { AppConfig } from '../../../config';
import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
    templateUrl: 'reset-password-page.component.html'
})
export class ResetPasswordPageComponent extends BasePageComponent {

    public readonly appLogo: string = AppConfig.AppLogoUrl;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // redirect to entry url if user is already logged
        if (this.dependencies.coreServices.authService.getAuthenticationStatus() === LogStatus.Authenticated) {
            this.dependencies.coreServices.navigateService.entryPage().navigate();
        }
    }
 
}
