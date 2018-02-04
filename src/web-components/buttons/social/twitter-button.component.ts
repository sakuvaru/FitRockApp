import { Component, Input } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'twitter-button',
    templateUrl: 'twitter-button.component.html'
})
export class TwitterButtonComponent extends BaseWebComponent {

    @Input() tooltip: string;

    @Input() text: string;

    /**
     * Can be used to force set width
     * Example: '100%'
     */
    @Input() width: string;

    public readonly defaultText: string = 'Twitter';

    constructor(
    ) { super();
    }
}
