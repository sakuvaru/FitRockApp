// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Rx';
import { UploaderConfig, UploaderModeEnum } from '../../../../web-components/uploader';
import { FileRecord } from '../../../models';

@Component({
    templateUrl: 'edit-avatar.component.html'
})
export class EditAvatarComponent extends BaseComponent implements OnInit {

    private uploaderConfig: UploaderConfig;

    private avatarSrc: string;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
        this.initUploader();
        super.subscribeToObservable(this.getAvatarObservable());
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
            .onAfterUpload<FileRecord>((avatar => {
                if (avatar && avatar.length === 1){
                    // update src of the avatar
                    this.avatarSrc = avatar[0].fileUrl;
                }
            }))
            .build();
    }

    private getAvatarObservable(): Observable<any> {
        // we load user from server because the avatar can change
        return this.dependencies.itemServices.userService.item()
            .byId(this.dependencies.authenticatedUserService.getUserId())
            .get()
            .map(response => {
                this.avatarSrc = response.item.avatarUrl;
            });
    }

}