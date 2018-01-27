import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';
import { WebColorEnum } from '../shared/enums/web-color.enum';

@Component({
    selector: 'badge',
    templateUrl: 'badge.component.html'
})
export class BadgeComponent extends BaseWebComponent {

    @Input() text: string;
    @Input() color: WebColorEnum = WebColorEnum.Blue;
    @Input() darkText: boolean = false;
    @Input() size: 'xs' | 'md' | 'sm' = 'sm';

    constructor(
    ) { super();
    }
}
