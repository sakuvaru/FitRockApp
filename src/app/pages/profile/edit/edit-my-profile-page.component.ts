import { Component, OnInit } from '@angular/core';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { MyProfileMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-my-profile-page.component.html'
})
export class EditMyProfilePageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.editProfile' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }
}
