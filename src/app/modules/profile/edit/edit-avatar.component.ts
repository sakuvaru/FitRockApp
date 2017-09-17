// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Rx';
import { UploaderConfig, UploaderModeEnum } from '../../../../web-components/uploader';

@Component({
    templateUrl: 'edit-avatar.component.html'
})
export class EditAvatarComponent extends BaseComponent implements OnInit {

    private uploaderConfig: UploaderConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
        this.initUploader();
    }

    private initMenu(): void {
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.avatar' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private initUploader(): void {
        var userId = this.dependencies.authenticatedUserService.getUserId();

        this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.uploader(UploaderModeEnum.SingleFile, (file: File) => this.dependencies.itemServices.fileRecordService.uploadAvatar(file, userId).set())
            .useDefaultImageExtensions(true)
            .build();
    }

}