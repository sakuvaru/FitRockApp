// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'add-button',
    templateUrl: 'add-button.component.html'
})
export class AddButtonComponent extends BaseWebComponent {

    @Input() tooltip: string;

    constructor(
    ) { super();
    }
}
