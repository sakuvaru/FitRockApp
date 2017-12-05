// common
import { Component, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { Image } from 'angular-modal-gallery';
import * as _ from 'underscore';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { GalleryGroup } from './gallery-group.class';
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

@Component({
    templateUrl: 'gallery-delete-dialog.component.html'
})
export class GalleryDeleteDialogComponent extends BaseWebComponent implements OnInit {

    public groups: GalleryGroup[];
    public imagesRaw: GalleryImage[];
    public images: Image[];
    public config: GalleryConfig;
    private snackBarService: MatSnackBar;

    public  imageDeletionFailed: boolean = false;

    private readonly snackbarDefaultDuration: number = 2500;

    /**
     * Text to be shown when file is deleted
     */
    private snackbarDeleteText: string;

    /**
     * Key used to translate deleted text
     */
    private snackbarDeleteTextKey: string = 'webComponents.gallery.deleted';

    /**
     * Indicates if delete is in progress
     */
    public deleteInProgress: boolean = false;

    private titleText: string;
    private messageText: string;
    private cancelText: string;
    private confirmText: string;
    public tooltipText: string;

    constructor(
        public dialogRef: MatDialogRef<GalleryDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private localizationService: LocalizationService,
        private dialogService: TdDialogService,
        private viewContainerRef: ViewContainerRef,
    ) {
        super();

        this.groups = data.groups;
        this.images = data.images;
        this.config = data.config;
        this.snackBarService = data.snackBarService;
        this.imagesRaw = data.imagesRaw;

        if (!this.config) {
            throw Error(`Gallery delete dialog needs to receive 'GalleryConfig'`);
        }

        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }

        // init translations
        this.localizationService.get('webComponents.gallery.dialogDelete.message').map(text => this.messageText = text)
            .zip(this.localizationService.get('webComponents.gallery.dialogDelete.title').map(text => this.titleText = text))
            .zip(this.localizationService.get('webComponents.gallery.dialogDelete.cancel').map(text => this.cancelText = text))
            .zip(this.localizationService.get('webComponents.gallery.dialogDelete.confirm').map(text => this.confirmText = text))
            .zip(this.localizationService.get('webComponents.gallery.dialogDelete.tooltip').map(text => this.tooltipText = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    ngOnInit() {
        this.initTranslations();
    }

    onDelete(image: Image): void {
        this.dialogService.openConfirm({
            message: this.messageText,
            disableClose: false, // defaults to false
            viewContainerRef: this.viewContainerRef, // OPTIONAL
            title: this.titleText, // OPTIONAL, hides if not provided
            cancelButton: this.cancelText, // OPTIONAL, defaults to 'CANCEL'
            acceptButton: this.confirmText, // OPTIONAL, defaults to 'ACCEPT'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                // do the delete
                this.deleteImage(image);
            } else {
                // user did not accepted delete
            }
        });
    }

    /**
     * Call after the delete was confirmed
     * @param image Image to delete
     */
    private deleteImage(image: Image): void {
        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }

        this.imageDeletionFailed = false;

        // get the proper GalleryImage
        const galleryImage = this.imagesRaw.find(m => m.imageUrl === image.extUrl);
        if (!galleryImage) {
            throw Error(`Could not map image '${image.extUrl}' to GalleryImage for deletion`);
        }

        // start loader
        if (this.config.loaderConfig) {
            this.config.loaderConfig.start();
        }

        this.deleteInProgress = true;

        this.config.deleteFunction(galleryImage)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(imageDeleted => {
                if (imageDeleted) {
                    // image was successfully deleted
                    if (this.config.onDelete && galleryImage) {
                        this.config.onDelete(galleryImage);
                    }

                    // remove image from local letiables
                    this.removeImage(image);

                    // show snackbar message
                    this.snackBarService.open(this.snackbarDeleteText, undefined, { duration: this.snackbarDefaultDuration });
                } else {
                    // image deletion failed
                    this.imageDeletionFailed = true;
                }

                // stop loader
                if (this.config.loaderConfig) {
                    this.config.loaderConfig.stop();
                }

                this.deleteInProgress = false;
            },
            error => {
                // image deletion faield
                this.imageDeletionFailed = true;

                // stop loader
                if (this.config.loaderConfig) {
                    this.config.loaderConfig.stop();
                }

                this.deleteInProgress = false;
            });
    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.gallery.deleted').subscribe(result => this.snackbarDeleteText = result);
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
            });
        }

        // if there are no images left, close dialog automatically
        if (this.images.length === 0) {
            this.dialogRef.close();
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
