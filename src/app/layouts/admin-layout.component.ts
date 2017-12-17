import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentDependencyService } from '../core';
import { BaseAdminLayoutComponent } from './base/base-admin-layout.component';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseAdminLayoutComponent  {

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(dependencies, cdr);
    }

}
