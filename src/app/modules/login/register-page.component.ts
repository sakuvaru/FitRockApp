import { Component } from '@angular/core';

import { UrlConfig } from '../../config';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    templateUrl: 'register-page.component.html'
})
export class RegisterPageComponent extends BaseComponent {

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
