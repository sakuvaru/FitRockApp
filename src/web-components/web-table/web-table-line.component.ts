import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';
import { WebColorEnum } from '../shared/enums/web-color.enum';

@Component({
    selector: 'web-table-line',
    templateUrl: 'web-table-line.component.html'
})
export class WebTableLineComponent extends BaseWebComponent {

    @Input() name: string;
    @Input() value: string;

    constructor(
    ) { super();
    }
}
