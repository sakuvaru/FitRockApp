import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ComponentDependencyService } from '../core';
import { BaseLayoutComponent } from './base/base-layout.component';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent extends BaseLayoutComponent {

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
        protected ngZone: NgZone
    ) {
        super(dependencies, ngZone);
    }
}
