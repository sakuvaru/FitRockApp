import { Component } from '@angular/core';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    template: ''
})
export class SampleComponent extends BasePageComponent {
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
