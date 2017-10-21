// common
import { Component, Input, Output, OnInit } from '@angular/core';
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

    /*
    private getTranslationKey(): string {
        if (this.count === 1) {
            return 'module.foodUnits.' + this.unitCode;
        }
        if (this.count === 2) {
            return 'module.foodUnits.pluralTwo.' + this.unitCode;
        }
        if (this.count === 0 || this.count > 5) {
            return 'module.foodUnits.pluralFive.' + this.unitCode;
        }
    }*/
}
