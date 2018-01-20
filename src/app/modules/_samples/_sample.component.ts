import { Component } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../core';

@Component({
    template: ''
})
export class SampleComponent extends BasePageComponent {
    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }
}
