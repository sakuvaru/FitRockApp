import { Component } from '@angular/core';

import { UrlConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { AppConfig } from 'app/config/app.config';

@Component({
    templateUrl: 'register-page.component.html'
})
export class RegisterPageComponent extends BaseComponent {

    public readonly appLogo: string = AppConfig.AppLogoUrl;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }
}
