import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'success-message',
    templateUrl: 'success-message.component.html'
})
export class SuccessMessageComponent extends BaseWebComponent {
    @Input() text: string;
    @Input() title: string;

    constructor(
    ) { super();
    }
}
