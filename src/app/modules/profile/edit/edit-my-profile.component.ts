// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { User } from '../../../models';
import { Observable } from 'rxjs/Rx';
import { languageHelper } from 'lib/repository';

@Component({
    templateUrl: 'edit-my-profile.component.html'
})
export class EditMyProfileComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
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
                if (this.dependencies.coreServices.currentLanguageService.isDifferentThanCurrent(response.item.getLanguageEnum())) {
                    // language has changed, update it
                    this.dependencies.coreServices.currentLanguageService.setLanguage(response.item.getLanguageEnum());

                    // update language of auth user
                    this.dependencies.authenticatedUserService.updateLanguage(response.item.getLanguageEnum());
                    
                    // finally reload page
                    this.dependencies.coreServices.systemService.reloadPage();
                }
            })
            .optionLabelResolver((field, label) => {
                if (field.key === 'Language') {
                    if (label === 'Default') {
                        return super.translate('shared.language.default');
                    } else if (label === 'Cz') {
                        return super.translate('shared.language.cz');
                    } else if (label === 'En') {
                        return super.translate('shared.language.en');
                    }
                }
                return Observable.of(label);
            })
            .build();
    }
}
