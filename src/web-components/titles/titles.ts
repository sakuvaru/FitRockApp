import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'title-1',
    template: '<h1 class="mat-headline">{{ text }}<ng-content></ng-content></h1>'
})
export class Title1Component extends BaseWebComponent {

    @Input() text: string;

    constructor(
    ) {
        super();
    }
}

@Component({
    selector: 'title-2',
    template: '<h2 class="mat-title">{{ text }}<ng-content></ng-content></h2>'
})
export class Title2Component extends BaseWebComponent {

    @Input() text: string;

    constructor(
    ) {
        super();
    }
}

@Component({
    selector: 'title-3',
    template: '<h3 class="mat-subheading-2">{{ text }}<ng-content></ng-content></h3>'
})
export class Title3Component extends BaseWebComponent {

    @Input() text: string;

    constructor(
    ) {
        super();
    }
}

@Component({
    selector: 'title-4',
    template: '<h4 class="mat-subheading-1">{{ text }}<ng-content></ng-content></h4>'
})
export class Title4Component extends BaseWebComponent {

    @Input() text: string;

    constructor(
    ) {
        super();
    }
}
