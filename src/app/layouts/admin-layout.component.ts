import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { TdRotateAnimation } from '@covalent/core';

import { ComponentDependencyService, MenuItem } from '../core';
import { BaseAdminLayoutComponent } from './base/base-admin-layout.component';
import { MatSidenav } from '@angular/material';

@Component({
    templateUrl: 'admin-layout.component.html',
    animations: [
        TdRotateAnimation({ anchor: 'rotate90', duration: 300, degrees: 90 }),
      ]
})
export class AdminLayoutComponent extends BaseAdminLayoutComponent  {

    public triggeredItems = {};

    private _rightSidenav: MatSidenav;
    @ViewChild('rightSidenav') set rightSidenav(content: MatSidenav) {
        if (content) {
            this._rightSidenav = content;
        }
    }

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
        protected location: Location,
        protected ngZone: NgZone
    ) {
        super(dependencies, cdr, location, ngZone);
    }

    handleMenuItemClick(item: MenuItem): void {
        if (!item.nestedItems) {
            // item does not have nested menu items, redirect
            this.dependencies.coreServices.navigateService.navigate([super.getMenuItemUrl(item.action, item.type)]);
            return;
        }

        // menu has nested items, show more
        const triggeredItem = this.triggeredItems[item.identifier];

        if (triggeredItem) {
            triggeredItem.triggered = !triggeredItem.triggered;
        } else {
            this.triggeredItems[item.identifier] = { triggered: true };
        }
    }

}
