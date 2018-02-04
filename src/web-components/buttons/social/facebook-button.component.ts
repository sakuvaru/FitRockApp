import { Component, Input } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'facebook-button',
    templateUrl: 'facebook-button.component.html'
})
export class FacebookButtonComponent extends BaseWebComponent {

    @Input() tooltip: string;

    @Input() text: string;

    /**
     * Can be used to force set width
     * Example: '100%'
     */
    @Input() width: string;

    public readonly defaultText: string = 'Facebook';

    constructor(
    ) { super();
    }
}
