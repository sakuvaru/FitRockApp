import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'app/config';
import { LogStatus } from 'lib/auth';

import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
    templateUrl: 'session-lock-page.component.html'
})
export class SessionLockPageComponent extends BasePageComponent implements OnInit {

    public readonly appLogo: string = AppConfig.AppLogoUrl;

    public email?: string;

    public userAvatarUrl?: string;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit(): void {
        // check user status
        const authUser = this.dependencies.coreServices.authService.getCurrentAuthUser();

        if (!authUser) {
            // redirect to logon page as user is not authenticated
            this.dependencies.coreServices.navigateService.loginPage().navigate();
            return;
        }

        if (authUser.status === LogStatus.Authenticated) {
            // user is authenticated correctly
            this.dependencies.coreServices.navigateService.entryPage().navigate();
            return;
        }

        if (authUser.status === LogStatus.TokenExpired) {
            // this is what we are looking for here - expired token
            if (!this.authUser) {
                // this should not happen here, but for safety check redirect him to login page
                this.dependencies.coreServices.navigateService.loginPage().navigate();
                return;
            }

            this.userAvatarUrl = this.authUser.getAvatarOrGravatarUrl();
            this.email = this.authUser.email;
        }
    }

}
