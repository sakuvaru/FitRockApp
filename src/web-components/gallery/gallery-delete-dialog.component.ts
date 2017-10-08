// common
import { Component, Inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

// gallery
import { Image } from 'angular-modal-gallery';

// models
import { GalleryGroup } from './gallery-group.class';
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

// helpers
import * as _ from 'underscore';

// translations
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'gallery-delete-dialog.component.html'
})
export class GalleryDeleteDialogComponent extends BaseWebComponent implements OnInit {

    public groups: GalleryGroup[];
    public imagesRaw: GalleryImage[];
    public images: Image[];
    private config: GalleryConfig;
    private snackBarService: MatSnackBar;

    private imageDeletionFailed: boolean = false;

    private readonly snackbarDefaultDuration: number = 2500;

    /**
     * Text to be shown when file is deleted
     */
    private snackbarDeleteText: string;

    /**
     * Key used to translate deleted text
     */
    private snackbarDeleteTextKey: string = 'webComponents.gallery.deleted';

    constructor(
        public dialogRef: MatDialogRef<GalleryDeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private translateService: TranslateService,
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
    }

    ngOnInit() {
        this.initTranslations();
    }

    onDelete(image: Image): void {
        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }

        this.imageDeletionFailed = false;

        // get the proper GalleryImage
        const galleryImage = this.imagesRaw.find(m => m.imageUrl === image.extUrl);
        if (!galleryImage) {
            throw Error(`Could not map image '${image.extUrl}' to GalleryImage for deletion`);
        }

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
                    this.snackBarService.open(this.snackbarDeleteText, undefined,  { duration: this.snackbarDefaultDuration});
                } else {
                    // image deletion failed
                    this.imageDeletionFailed = true;
                }
            },
            error => {
                // image deletion faield
                this.imageDeletionFailed = true;
            });
    }

    private initTranslations(): void {
        this.translateService.get('webComponents.gallery.deleted').subscribe(result => this.snackbarDeleteText = result);
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
