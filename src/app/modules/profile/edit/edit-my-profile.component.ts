import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-edit-my-profile',
    templateUrl: 'edit-my-profile.component.html'
})
export class EditMyProfileComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initForm();
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
