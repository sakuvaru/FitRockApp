import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

/*
Notes:

fxFlexFill on headers ensures that the element will fill its parent. This is useful if vertical alignment is required. Example:

    <div fxLayout="row" fxLayoutAlign="start center" class="push w-layout-component-title">
      <div fxLayout="column" *ngIf="menuAvatarUrl">
        <img alt="menu avatar" [src]="menuAvatarUrl" />
      </div>
      <div fxLayout="column">
        <title-1>{{ menuTitle }}</title-1>
      </div>
    </div>
    
*/

@Component({
    selector: 'title-1',
    template: '<h1 fxFlexFill class="mat-headline">{{ text }}<ng-content></ng-content></h1>'
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
    template: '<h2 fxFlexFill class="mat-title">{{ text }}<ng-content></ng-content></h2>'
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
    template: '<h3 fxFlexFill class="mat-subheading-2">{{ text }}<ng-content></ng-content></h3>'
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
    template: '<h4 fxFlexFill class="mat-subheading-1">{{ text }}<ng-content></ng-content></h4>'
})
export class Title4Component extends BaseWebComponent {

    @Input() text: string;

    constructor(
    ) {
        super();
    }
}
