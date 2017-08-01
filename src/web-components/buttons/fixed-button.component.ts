// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'fixed-button',
    templateUrl: 'fixed-button.component.html'
})
export class FixedButtonComponent extends BaseWebComponent{
    @Input() url: string;
    @Input() icon: string;

    // Available options are:
    // https://github.com/Teradata/covalent-nightly/blob/master/common/styles/_button.scss
    @Input() position: string;

    private default_position = 'mat-fab-bottom-right';
    private default_icon = 'add';
    
    constructor() {
        super()
    }

    private getPositionClass(): string {
        if (this.position){
            return this.position;
        }

        return this.default_position;
    }

    private getIcon(): string{
        if (this.icon){
            return this.icon;
        }

        return this.default_icon;
    }
}