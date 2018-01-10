import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'plural-food-units',
    templateUrl: 'plural-food-units.component.html'
})
export class PluralFoodUnitsComponent extends BaseWebComponent {

    @Input() count: number = 0;
    @Input() unitCode: string;

    constructor(
    ) { super();
    }
}
