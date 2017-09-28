// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'dialog-button',
    templateUrl: 'dialog-button.component.html'
})
export class DialogButtonComponent extends BaseWebComponent {

    constructor(
    ) { super()
    }

    @Input() type: 'normal' = 'normal'; // can be extended in future if needed
    @Input() text: string;
    @Input() tooltip: string;
}