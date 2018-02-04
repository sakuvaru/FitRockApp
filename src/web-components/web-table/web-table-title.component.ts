import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';
import { WebColorEnum } from '../shared/enums/web-color.enum';

@Component({
    selector: 'web-table-title',
    templateUrl: 'web-table-title.component.html'
})
export class WebTableTitleComponent extends BaseWebComponent {

    constructor(
    ) { super();
    }
}
