import { Component } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'no-data-message',
    templateUrl: 'no-data-message.component.html'
})
export class NoDataMessageComponent extends BaseWebComponent {

    constructor(
    ) { super();
    }
}
