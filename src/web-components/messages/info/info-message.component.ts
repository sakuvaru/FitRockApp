// common
import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'info-message',
    templateUrl: 'info-message.component.html'
})
export class InfoMessageComponent extends BaseWebComponent {
    
    @Input() text: string;
    @Input() title: string;

    constructor(
    ) { super();
    }
}
