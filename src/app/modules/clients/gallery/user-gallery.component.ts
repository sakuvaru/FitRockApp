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
import { FetchedFile } from '../../../../lib/repository';
import { GalleryConfig, GalleryImage } from '../../../../web-components/gallery';
import * as _ from 'underscore';

@Component({
    templateUrl: 'user-gallery.component.html'
})
export class UserGalleryComponent extends ClientsBaseComponent implements OnInit {

    /**
     * This property is used to add uploaded images to gallery config
     */
    private currentImages: GalleryImage[] = [];

    private uploaderConfig: UploaderConfig;
    private galleryConfig: GalleryConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getInitUploaderObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.uploader(
                    UploaderModeEnum.MultipleFiles,
                    (files: File[]) => this.dependencies.itemServices.fileRecordService.uploadGalleryImages(files, clientId)
                        .set())
                    .useDefaultImageExtensions(true)
                    .onAfterUpload<FileRecord>((files => {
                        if (files){
                            // append uploaded files to current gallery list
                            this.currentImages = _.union(this.currentImages, files.map(m => new GalleryImage({
                               imageUrl: m.fetchedFile.absoluteUrl,
                               imageDate: m.fetchedFile.fileLastModified
                            })));

                            // refresh gallery
                            this.galleryConfig = this.getGalleryConfig(this.currentImages);
                        }
                    }))
                    .loaderConfig({ start: () => super.startGlobalLoader(), stop: () => super.stopGlobalLoader()})
                    .build();
            });
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];
        observables.push(this.getUserGalleryFilesObservable());
        observables.push(this.getClientMenuObservable());
        observables.push(this.getInitUploaderObservable())
        return observables;
    }

    private getUserGalleryFilesObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.fileRecordService.getGalleryFiles(clientId).set())
            .map(response => {
                if (response.files) {
                    var galleryImages = response.files.map(m => new GalleryImage({
                       imageUrl: m.absoluteUrl 
                    }));

                    this.currentImages = galleryImages;
                    this.galleryConfig = this.getGalleryConfig(galleryImages);
                }
            })
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
                        'key': 'module.clients.submenu.gallery'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });
    }

    private getGalleryConfig(images: GalleryImage[]): GalleryConfig {
        return this.dependencies.webComponentServices.galleryService.gallery({
            images: images
        })
            .build();;
    }
}

