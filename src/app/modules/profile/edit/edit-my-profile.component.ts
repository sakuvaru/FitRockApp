// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { User } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-my-profile.component.html'
})
export class EditMyProfileComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
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
            .onAfterEdit(response => {
                if (this.dependencies.coreServices.currentLanguage.isDifferentThanCurrent(response.item.language)) {
                    // language has changed, update it
                    this.dependencies.coreServices.currentLanguage.setLanguage(response.item.language);

                    // reload page to see new translation
                    this.dependencies.coreServices.systemService.reloadPage();
                }
            })
            .build();
    }
}
