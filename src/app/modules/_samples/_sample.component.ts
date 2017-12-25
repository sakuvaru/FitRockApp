import { Component } from '@angular/core';

import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../core';

@Component({
    template: ''
})
export class SampleComponent extends BaseComponent {
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
