import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';
import { WebColorEnum } from '../shared/enums/web-color.enum';

@Component({
    selector: 'web-table',
    templateUrl: 'web-table.component.html'
})
export class WebTableComponent extends BaseWebComponent {

    constructor(
    ) { super();
    }
}
