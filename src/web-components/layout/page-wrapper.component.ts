// common
import { Component } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'page-wrapper',
    templateUrl: 'page-wrapper.component.html'
})
export class PageWrapperComponent extends BaseWebComponent {
    
    constructor(
    ) { super();
    }
}
