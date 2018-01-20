import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { FetchedFile } from '../../../../lib/repository';
import { UploaderConfig } from '../../../../web-components/uploader';
import { BaseModuleComponent, ComponentDependencyService } from '../../../core';

@Component({
    selector: 'mod-edit-avatar',
    templateUrl: 'edit-avatar.component.html'
})
export class EditAvatarComponent extends BaseModuleComponent implements OnInit {

    public uploaderConfig: UploaderConfig;

    public avatarSrc?: string;
    public gravatarUrl?: string;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initUploader();
        super.subscribeToObservable(this.getAvatarObservable());
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
