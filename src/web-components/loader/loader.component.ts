// common
import { Component, Input, Output, OnInit } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'loader',
    templateUrl: 'loader.component.html'
})
export class LoaderComponent extends BaseWebComponent{
    @Input() enabled: boolean;
    @Input() color: 'primary' | 'accent' = 'primary'

    constructor(
    ) { super()
    }
}