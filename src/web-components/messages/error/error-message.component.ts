import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'error-message',
    templateUrl: 'error-message.component.html'
})
export class ErrorMessageComponent extends BaseWebComponent {
    @Input() text: string;
    @Input() title: string;

    constructor(
    ) { super();
    }
}
