import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentDependencyService } from '../core';
import { BaseAdminLayoutComponent } from './base/base-admin-layout.component';
import { Location } from '@angular/common';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseAdminLayoutComponent  {

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
        protected location: Location
    ) {
        super(dependencies, cdr, location);
    }

}
