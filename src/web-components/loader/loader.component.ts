import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html'
})
export class LoaderComponent extends BaseWebComponent {

    @Input() enabled: boolean;
    @Input() color: 'primary' | 'accent' = 'primary';
    @Input() type: 'linear' | 'circular' = 'linear';

    constructor(
    ) { super();
    }
}
