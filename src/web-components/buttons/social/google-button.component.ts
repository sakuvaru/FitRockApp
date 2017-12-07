import { Component, Input } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'google-button',
    templateUrl: 'google-button.component.html',
    styleUrls: ['social-buttons.scss']
})
export class GoogleButtonComponent extends BaseWebComponent {

    @Input() tooltip: string;

    @Input() text: string;

    /**
     * Can be used to force set width
     * Example: '100%'
     */
    @Input() width: string;

    public readonly defaultText: string = 'Google';

    constructor(
    ) { super();
    }
}
