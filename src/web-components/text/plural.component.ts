import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'plural',
    templateUrl: 'plural.component.html'
})
export class PluralComponent extends BaseWebComponent {

    @Input() showNumber: boolean = true;

    @Input() count: number = 0;

    /**
     * These properties represent key of the form for (0, 1, 2, 5 and more item count)
     */
    @Input() m0: string;
    @Input() m1: string;
    @Input() m2: string;
    @Input() m5: string;

    constructor(
    ) { super();
    }
}
