// common
import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { UploaderConfig } from '../../../../web-components/uploader';
import { FileRecord } from '../../../models';
import { FetchedFile } from '../../../../lib/repository';
import { GalleryConfig, GalleryImage, GalleryGroup, ImageGroupResult, GalleryComponent } from '../../../../web-components/gallery';
import * as _ from 'underscore';

@Component({
    templateUrl: 'user-gallery.component.html'
})
export class UserGalleryComponent extends ClientsBaseComponent implements OnInit {

    /**
     * This property is used to add uploaded images to gallery config
     */
    public currentImages: GalleryImage[] = [];

    public uploaderConfig: UploaderConfig;
    public galleryConfig: GalleryConfig;

    @ViewChild(GalleryComponent) galleryComponent: GalleryComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
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
                this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.multipleUpload(
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

                            // reload gallery
                            this.galleryComponent.reloadData();
                        }
                    }))
                    .build();
            });
    }

    private getComponentObservables(): Observable<void>[] {
        const observables: Observable<void>[] = [];
        observables.push(this.getInitGalleryObservable());
        observables.push(this.getClientMenuObservable());
        observables.push(this.getInitUploaderObservable());
        return observables;
    }

    private getInitGalleryObservable(): Observable<void> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.galleryConfig = this.getGalleryConfig(clientId);
            });
    }

    private getGalleryImagesObservable(clientId: number): Observable<GalleryImage[]> {
        return this.dependencies.fileService.getGalleryFiles(clientId).set()
            .map(response => {
                if (response.files) {
                    const galleryImages = response.files.map(m => new GalleryImage({
                        imageUrl: m.absoluteUrl,
                        imageDate: m.fileLastModified
                        // used for testing the gallery grouping -> imageDate: super.moment(m.fileLastModified).add(Math.floor(Math.random() * 20), 'days').toDate()
                    }));

                    return galleryImages;
                }
                return [];
            });
    }

    private getClientMenuObservable(): Observable<void> {
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

    private getGalleryConfig(clientId: number): GalleryConfig {
        return this.dependencies.webComponentServices.galleryService.gallery(
            this.getGalleryImagesObservable(clientId)
        )
            .isDownlodable(true)
            .groupResolver((galleryImage: GalleryImage) => {
                // group images by day
                const startOf = 'day';

                return galleryImage.imageDate
                    ? new ImageGroupResult(this.dependencies.coreServices.timeService.moment(galleryImage.imageDate).startOf(startOf).format('LL'), galleryImage.imageDate
                    )
                    : new ImageGroupResult('');
            })
            .groupsOrder((groups: GalleryGroup[]) => _.sortBy(groups, (m) => m.groupDate).reverse())
            .deleteFunction((image: GalleryImage) => this.dependencies.fileService.deleteFile(image.imageUrl)
                .set()
                .map(response => response.fileDeleted)
            )
            .onImagesLoaded(images => {
                this.currentImages = images;
            })
            .build();
    }

    onImagesChange(images: GalleryImage[]): void {
        // update current images so that no duplicates are inserted to gallery
        this.currentImages = images;
    }
}

