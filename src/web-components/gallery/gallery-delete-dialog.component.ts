// common
import { Component, Inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// material
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

// gallery
import { Image } from 'angular-modal-gallery';

// models
import { GalleryGroup } from './gallery-group.class';
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

// helpers
import * as _ from 'underscore';

@Component({
    templateUrl: 'gallery-delete-dialog.component.html'
})
export class GalleryDeleteDialogComponent extends BaseWebComponent implements OnInit {

    public groups: GalleryGroup[];
    public images: Image[];
    private config: GalleryConfig;

    private imageDeletionFailed: boolean = false;

    constructor(
        public dialogRef: MdDialogRef<GalleryDeleteDialogComponent>,
        @Inject(MD_DIALOG_DATA) public data: any) {
        super();

        this.groups = data.groups;
        this.images = data.images;
        this.config = data.config;

        if (!this.config) {
            throw Error(`Gallery delete dialog needs to receive 'GalleryConfig'`);
        }

        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }
    }

    ngOnInit() {

    }

    onDelete(image: Image): void {
        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }

        this.imageDeletionFailed = false;

        // get the proper GalleryImage
        var galleryImage = this.config.images.find(m => m.imageUrl === image.extUrl);
        if (!galleryImage) {
            throw Error(`Could not map image '${image.extUrl}' to GalleryImage for deletion`);
        }

        this.config.deleteFunction(galleryImage)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(imageDeleted => {
                if (imageDeleted) {
                    // image was successfully deleted
                    if (this.config.onDelete && galleryImage){
                        this.config.onDelete(galleryImage);
                    }

                    // remove image from local variables
                    this.removeImage(image);
                }
                else {
                    // image deletion failed
                    this.imageDeletionFailed = true;
                }
            },
            error => {
                // image deletion faield
                this.imageDeletionFailed = true;
            })
    }

    private removeImage(image: Image): void {
        // remove image
        this.images = _.reject(this.images, function (item) { return item.extUrl === image.extUrl; });

        // remove image from groups as well
        if (this.groups) {
            this.groups.forEach(group => {
                group.images = _.reject(group.images, function (item) { return item.extUrl === image.extUrl; });

                // if group has 0 images, remove it as well
                if (group.images.length === 0) {
                    this.groups = _.reject(this.groups, function (item) { return item.groupTitle === group.groupTitle; });
                }
            })
        }
    }

    onClose(): void {
        this.dialogRef.close();
    }
}