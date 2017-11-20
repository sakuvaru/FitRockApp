// common
import { Component, Input, OnInit, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';
import { Observable } from 'rxjs/Rx';

// gallery classes
import { Image, Description, ImageModalEvent } from 'angular-modal-gallery';

// required by component
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';
import { GalleryGroup } from './gallery-group.class';
import { ImageGroupResult } from './image-group-result.class';

// dialog
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GalleryDeleteDialogComponent } from './gallery-delete-dialog.component';

// material
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'gallery',
    templateUrl: 'gallery.component.html'
})
export class GalleryComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Gallery configuration
     */
    @Input() config: GalleryConfig;

    /**
     * Executed when the images change
     */
    @Output() imagesUpdated: EventEmitter<GalleryImage[]> = new EventEmitter<GalleryImage[]>();

    /**
     * Component initiliazed flag
     */
    public initialized: boolean = false;

    /**
     * Gallery images
     */
    private images: Image[];

    /**
     * Gallery images with their initial format
     */
    private imagesRaw: GalleryImage[];

    /**
     * Groups with images
     */
    private groups: GalleryGroup[] | null = null;

    /**
     * Buttons configuration
     */
    private buttonsConfig: any = {};

    /**
     * Full description
     */
    private customFullDescription: Description;

    /**
     * Indicates if local loader should be enabled
     */
    private localLoaderEnabled: boolean = false;

    /**
     * This is required for the image pointer feature
     */
    private openModalWindow: boolean = false;
    private imagePointer: number = 0;

    /**
     * This indicates number of loaded images in all 'src' tags. 
     * https://stackoverflow.com/questions/39257687/detect-when-image-has-loaded-in-img-tag
     */
    private numberOfLoadedImages: number = 0;

    /**
     * Indicates total number of images
     */
    private totalImages: number = -1;

    constructor(
        public dialog: MatDialog,
        public snackBarService: MatSnackBar
    ) {
        super();
    }

    ngOnInit() {
        if (this.config) {
            this.initGallery(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            this.initGallery(changes.config.currentValue);
        }
    }

    public reloadData(): void {
        this.initialized = false;
        this.initGallery(this.config);
    }

    private initGallery(config: GalleryConfig) {
        if (!config) {
            console.warn('Gallery could not be initialized');
            return;
        }

        // don't initialize multiple times
        if (this.initialized) {
            return;
        }
        
        // make sure config is assigned
        this.config = config;

        if (this.config.enableLocalLoader) {
            this.localLoaderEnabled = true;
        }

        if (this.config.loaderConfig) {
            this.config.loaderConfig.start();
        }

        // reset total images
        this.totalImages = -1;

        // reset number of loaded images
        this.numberOfLoadedImages = 0;

        // init buttons config
        this.buttonsConfig = this.getButtonsConfig(config);

        // init custom description
        this.customFullDescription = this.getCustomDescription();

        // init gallery with images & groups
        this.getGalleryInitObservable(config)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                // finally mark component as initialized
                this.initialized = true;

                if (this.config.enableLocalLoader) {
                    this.localLoaderEnabled = false;
                }

                if (this.config.loaderConfig) {
                    this.config.loaderConfig.stop();
                }
            });
    }

    private getGalleryInitObservable(config: GalleryConfig): Observable<void> {
        return this.config.images.map(images => {

            // init gallery groups if configured
            if (config.groupResolver) {
                this.groups = this.getGalleryGroups(config, images);
            }

            // assign Images
            this.images = this.convertArrayToImageType(images);

            // assign GalleryImages
            this.imagesRaw = images;

            // set number of total images
            this.totalImages = images.length;

            // images loaded callback
            if (config.onImagesLoaded) {
                this.config.onImagesLoaded(images);
            }
        });
    }

    private openImageModal(image: Image) {
        // find image based on its URL
        const imageToOpen = this.images.find(m => m.extUrl === image.extUrl);
        if (!imageToOpen) {
            console.warn('Could not open image in modal:');
            console.warn(image);
        } else {
            this.imagePointer = this.images.indexOf(imageToOpen);
            this.openModalWindow = true;
        }
    }

    private onShowImageModal(event: ImageModalEvent) {
    }

    private onCloseImageModal(event: ImageModalEvent) {
        this.openModalWindow = false;
    }

    private getGalleryGroups(config: GalleryConfig, images: GalleryImage[]): GalleryGroup[] {
        let groups: GalleryGroup[] = [];

        // go through each image and assign it to correct group based on the evaluation function
        if (!config || !images || !Array.isArray(images)) {
            throw Error(`Could not evaluate gallery groups`);
        }

        images.forEach(image => {

            if (!config.groupResolver) {
                throw Error(`Could not evaluate gallery groups because no resolver is defined`);
            }

            // get image group
            const imageGroup = config.groupResolver(image);

            // create group if not exist
            const group = groups.find(m => m.groupTitle === imageGroup.groupTitle);
            if (!group) {
                // group does not exist, create it
                groups.push(new GalleryGroup(imageGroup.groupTitle, [this.convertToImageType(image)], imageGroup.groupDate));
            } else {
                // group exists, push the image
                group.images.push(this.convertToImageType(image));
            }
        });

        // order groups
        if (config.groupsOrder) {
            groups = config.groupsOrder(groups);
        }

        return groups;
    }

    private getButtonsConfig(config: GalleryConfig): any {
        if (config.downloadable) {
            const buttonsConfig: any = {};
            buttonsConfig.download = true;
            return buttonsConfig;
        }
        return null;
    }

    private convertToImageType(image: GalleryImage): Image {
        if (!image) {
            throw Error(`Could not convert 'GalleryImage' to 'Image'`);
        }

        return new Image(
            image.imageUrl,
            image.thumbnailUrl,
            image.description,
            image.imageUrl
        );
    }

    private convertArrayToImageType(images: GalleryImage[]): Image[] {
        if (!images || !Array.isArray(images)) {
            return [];
        }

        return images.map(m => this.convertToImageType(m));
    }

    private getCustomDescription(): Description {
        const customFullDescription: Description = {
            // you should build this value programmaticaly with the result of (show)='..()' event
            // if customFullDescription !== undefined, all other fields will be ignored
            imageText: '', // removes the 'Image' string from the gallery
            numberSeparator: '/',
            // beforeTextDescription: '',
        };

        return customFullDescription;
    }

    private openDeleteDialog(): void {
        const dialogRef = this.dialog.open(GalleryDeleteDialogComponent, {
            width: this.config.dialogWidth,
            data: { 
                groups: this.groups, 
                images: this.images, 
                config: this.config, 
                snackBarService: this.snackBarService,
                imagesRaw: this.imagesRaw 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // check if images changed and if so, fire event
            let executeUpdateImages = false;
            if (this.images.length !== dialogRef.componentInstance.images.length) {
                // some images were deleted
                // get gallery image objects of current images
                executeUpdateImages = true;
            }

            // update images & groups in case some images were deleted
            this.groups = dialogRef.componentInstance.groups;
            this.images = dialogRef.componentInstance.images;

            if (executeUpdateImages) {
                // get GalleryImages of current Images
                const galleryImages: GalleryImage[] = [];
                this.images.forEach(image => {
                    const galleryImage = this.imagesRaw.find(m => m.imageUrl === image.extUrl);
                    if (galleryImage) {
                        galleryImages.push(galleryImage);
                    }
                });
                this.imagesUpdated.next(galleryImages);
            }
        });
    }

    private loadImage(): void {
        this.numberOfLoadedImages++;
    }
}
