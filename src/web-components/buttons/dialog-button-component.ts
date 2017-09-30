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

    @Output() handleClick = new EventEmitter();

    @Input() color: 'primary' | 'accent' = 'primary';

    @Input() tooltip: string;
    
    @Input() disabled: boolean;

    private onClick(): void{
        if (!this.disabled){
            this.handleClick.next();
        }
    }
    
}