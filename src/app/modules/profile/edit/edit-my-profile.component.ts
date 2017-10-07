// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { User } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-my-profile.component.html'
})
export class EditMyProfileComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<User>;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    setup(): ComponentSetup {
         return {
             initialized: true
         };
    }

    ngOnInit() {
        super.ngOnInit();
        this.initMenu();
        this.initForm();
    }

    private initMenu(): void {
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.editProfile' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.userService.myProfileForm()
            .enableDelete(false)
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .build();
    }
}