// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { UploaderConfig, UploaderModeEnum } from '../../../../web-components/uploader';
import { FileRecord } from '../../../models';
import * as _ from 'underscore';

@Component({
    templateUrl: 'user-gallery.component.html'
})
export class UserGalleryComponent extends ClientsBaseComponent implements OnInit {

    private uploaderConfig: UploaderConfig;
    private galleryFiles: FileRecord[];

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initUploader();
        super.subscribeToObservable(this.getClientMenuObservable());
        super.initClientSubscriptions();
    }

    private initUploader(): void {
        var userId = this.dependencies.authenticatedUserService.getUserId();

        this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.uploader(
            UploaderModeEnum.MultipleFiles,
            (files: File[]) => this.dependencies.itemServices.fileRecordService.uploadGalleryImages(files, userId)
                .set())
            .useDefaultImageExtensions(true)
            .onAfterUpload<FileRecord>((files => {
                // append uploaded files to current gallery list
                this.galleryFiles = _.union(this.galleryFiles, files);
            }))
            .build();
    }

    private getUserGalleryFilesObservable(): Observable<any> {
        return Observable.of(null); // todo
    }

    private getClientMenuObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.stats'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });
    }
}

