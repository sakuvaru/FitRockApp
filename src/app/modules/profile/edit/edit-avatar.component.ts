// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Rx';
import { UploaderConfig } from '../../../../web-components/uploader';
import { FetchedFile } from '../../../../lib/repository';

@Component({
    templateUrl: 'edit-avatar.component.html'
})
export class EditAvatarComponent extends BaseComponent implements OnInit {

    public uploaderConfig: UploaderConfig;

    public avatarSrc?: string;
    public gravatarUrl?: string;

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
        const userId = this.dependencies.authenticatedUserService.getUserId();

        this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.singleUpload(
            (file: File) => this.dependencies.fileService.uploadAvatar(file, userId)
            .set())
            .useDefaultImageExtensions(true)
            .onAfterUpload<FetchedFile>((avatar => {
                if (avatar && avatar.length === 1) {
                    const avatarUrl = avatar[0].absoluteUrl;

                    // update src of the avatar
                    this.avatarSrc = avatarUrl;

                    // update avatar in local storage
                    this.dependencies.authenticatedUserService.updateAvatar(avatarUrl);
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
                this.gravatarUrl = response.item.gravatarUrl;
            });
    }
}
