import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { FetchedFile } from '../../../../lib/repository';
import {
    GalleryComponent,
    GalleryConfig,
    GalleryGroup,
    GalleryImage,
    ImageGroupResult,
} from '../../../../web-components/gallery';
import { UploaderConfig } from '../../../../web-components/uploader';
import { ComponentDependencyService } from '../../../core';
import { BaseClientModuleComponent } from '../base-client-module.component';

@Component({
    selector: 'mod-user-gallery',
    templateUrl: 'user-gallery.component.html'
})
export class UserGalleryComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    /**
     * This property is used to add uploaded images to gallery config
     */
    public currentImages: GalleryImage[] = [];

    public uploaderConfig: UploaderConfig;
    public galleryConfig: GalleryConfig;

    @ViewChild(GalleryComponent) galleryComponent: GalleryComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.client) {
            this.init();
        }
    }

    private init(): void {
        this.initUploader();
        this.initGallery();
        super.subscribeToObservable(this.getGalleryImagesObservable());
    }

    private initUploader(): void {
        this.uploaderConfig = this.dependencies.webComponentServices.uploaderService.multipleUpload(
            (files: File[]) => this.dependencies.fileService.uploadGalleryImages(files, this.client.id)
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
    }

    private initGallery(): void {
        this.galleryConfig = this.getGalleryConfig();
    }

    private getGalleryImagesObservable(): Observable<GalleryImage[]> {
        return this.dependencies.fileService.getGalleryFiles(this.client.id).set()
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

    private getGalleryConfig(): GalleryConfig {
        return this.dependencies.webComponentServices.galleryService.gallery(
            this.getGalleryImagesObservable()
        )
            .isDownloadable(true)
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

