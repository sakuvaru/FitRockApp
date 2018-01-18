import { Component } from '@angular/core';
import { AppConfig } from 'app/config';
import { LogStatus } from 'lib/auth';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    selector: 'login-page',
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent extends BasePageComponent {

    public readonly appLogo: string = AppConfig.AppLogoUrl;
    
    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);

        // redirect to entry url if user is already logged
        if (this.dependencies.coreServices.authService.getAuthenticationStatus() === LogStatus.Authenticated) {
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
