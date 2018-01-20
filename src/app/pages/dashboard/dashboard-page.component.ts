import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../core';

@Component({
    templateUrl: 'dashboard-page.component.html'
})
export class DashboardPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit(): void {
        this.setConfig({
            menuTitle: { key: 'menu.main' },
            componentTitle: { key: 'menu.dashboard' }
        });
    }
}
