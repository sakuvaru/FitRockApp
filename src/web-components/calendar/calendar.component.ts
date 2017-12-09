import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'calendar',
    templateUrl: 'calendar.component.html'
})
export class CalendarComponent extends BaseWebComponent {

    constructor(
    ) { super();
    }
}
