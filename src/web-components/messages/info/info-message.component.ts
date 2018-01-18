import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';
import { DismissableMessageComponent } from '../base/dismissable-message.component';

@Component({
    selector: 'info-message',
    templateUrl: 'info-message.component.html'
})
export class InfoMessageComponent extends DismissableMessageComponent {
    
    @Input() text: string;
    @Input() title: string;

    constructor(
    ) { super();
    }
}
