import { Component } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'close-button',
    templateUrl: 'close-button.component.html'
})
export class CloseButtonComponent extends BaseWebComponent {

    constructor(
    ) { super();
    }
}
