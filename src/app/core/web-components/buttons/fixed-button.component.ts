// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'fixed-button',
    templateUrl: 'fixed-button.component.html'
})
export class FixedButtonComponent {
    @Input() url: string;
    @Input() icon: string;

    // Available options are:
    // https://github.com/Teradata/covalent-nightly/blob/master/common/styles/_button.scss
    @Input() position: string;

    // options: accent, primary, warn
    @Input() color: string;

    private default_position = 'mat-fab-bottom-right';
    private default_color = 'accent';
    private default_icon = 'add';

    constructor() {
    }

    private getPositionClass(): string {
        if (this.position){
            return this.position;
        }

        return this.default_position;
    }

    private getColor(): string{
        if (this.color){
            return this.color;
        }

        return this.default_color;
    }

    private getIcon(): string{
        if (this.icon){
            return this.icon;
        }

        return this.default_icon;
    }
}