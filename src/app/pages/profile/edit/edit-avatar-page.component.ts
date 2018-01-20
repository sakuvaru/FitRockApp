import { Component, OnInit } from '@angular/core';

import { UploaderConfig } from '../../../../web-components/uploader';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { MyProfileMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-avatar-page.component.html'
})
export class EditAvatarPageComponent extends BasePageComponent implements OnInit {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.avatar' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }
}
