// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { UploaderConfig, UploaderModeEnum } from '../../../../web-components/uploader';
import { FileRecord } from '../../../models';
import { FetchedFile } from '../../../../lib/repository';
import { GalleryConfig, GalleryImage, GalleryGroup, ImageGroupResult } from '../../../../web-components/gallery';
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

    setup(): ComponentSetup | null {
        return {
            initialized: false
        }
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
                    (files: File[]) => this.dependencies.fileService.uploadGalleryImages(files, clientId)
                        .set())
                    .useDefaultImageExtensions(true)
                    .onAfterUpload<FetchedFile>((files => {
                        if (files) {
                            // append uploaded files to current gallery list
                            this.currentImages = _.union(this.currentImages, files.map(m => new GalleryImage({
                                imageUrl: m.absoluteUrl,
                                imageDate: m.fileLastModified
                            })));

                            // refresh gallery
                            this.galleryConfig = this.getGalleryConfig(this.currentImages);
                        }
                    }))
                    .loaderConfig({ start: () => super.startGlobalLoader(), stop: () => super.stopGlobalLoader() })
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
            .switchMap(clientId => this.dependencies.fileService.getGalleryFiles(clientId).set())
            .map(response => {
                if (response.files) {
                    var galleryImages = response.files.map(m => new GalleryImage({
                        imageUrl: m.absoluteUrl,
                        imageDate: m.fileLastModified
                        // used for testing the gallery grouping -> imageDate: super.moment(m.fileLastModified).add(Math.floor(Math.random() * 20), 'days').toDate()
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
        .isDownlodable(true)
        .groupResolver((galleryImage: GalleryImage) => {
            // group images by day
            return galleryImage.imageDate ? new ImageGroupResult(super.moment(galleryImage.imageDate).format('LL'), super.moment(galleryImage.imageDate).startOf('day').toDate()) : new ImageGroupResult('');
        })
        .groupsOrder((groups: GalleryGroup[]) => _.sortBy(groups, (m) => m.groupDate).reverse())
        .deleteFunction((image: GalleryImage) => {
            return this.dependencies.fileService.deleteFile(image.imageUrl)
                .set()
                .map(response => response.fileDeleted)
        })
        .build();
    }

    private onImagesChange(images: GalleryImage[]): void {
        // update current images so that no duplicates are inserted to gallery
        this.currentImages = images;
    }
}

