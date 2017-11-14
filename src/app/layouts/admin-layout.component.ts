
// common
import { Component, ChangeDetectorRef } from '@angular/core';
import { ComponentDependencyService } from '../core';
import { AppConfig, UrlConfig } from '../config';

// required by component
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
