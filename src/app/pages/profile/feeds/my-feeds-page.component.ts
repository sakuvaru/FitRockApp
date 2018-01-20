import { Component, OnInit } from '@angular/core';

import { LoadMoreConfig } from '../../../../web-components/load-more';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { MyProfileMenuItems } from '../menu.items';

@Component({
    templateUrl: 'my-feeds-page.component.html'
})
export class MyFeedsPageComponent extends BasePageComponent implements OnInit {
    public loadMoreConfig: LoadMoreConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.feeds' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }
}
