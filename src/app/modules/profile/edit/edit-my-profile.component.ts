// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent } from '../../../core';

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

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
        super.subscribeToObservable(this.getFormObservable());
    }

    private initMenu(): void{
        
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.editProfile' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private getFormObservable(): Observable<any> {
        return this.dependencies.itemServices.userService.myProfileForm()
            .map(form => {
                // disable delete on this form
                form.enableDelete(false);

                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());

                // get form
                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}