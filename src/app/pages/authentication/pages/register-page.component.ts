import { Component } from '@angular/core';
import { AppConfig } from 'app/config/app.config';

import { BasePageComponent, ComponentDependencyService } from '../../../core';

@Component({
    templateUrl: 'register-page.component.html'
})
export class RegisterPageComponent extends BasePageComponent {

    public readonly appLogo: string = AppConfig.AppLogoUrl;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

}
