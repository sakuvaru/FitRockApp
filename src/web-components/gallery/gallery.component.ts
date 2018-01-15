import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import {
    ButtonEvent,
    ButtonsConfig,
    ButtonsStrategy,
    ButtonType,
    Description,
    DescriptionStrategy,
    Image,
    LineLayout,
    PlainGalleryConfig,
    PlainGalleryStrategy,
} from 'angular-modal-gallery';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { GalleryGroup } from './gallery-group.class';
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

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

    private readonly snackbarDefaultDuration: number = 2500;

    /**
     * Contains list of currently deleted images
     */
    private deletedImageIds: number[] = [];

    /**
     * Component initiliazed flag
     */
    public initialized: boolean = false;

    /**
     * Gallery images
     */
    private images: Image[];

    /**
     * Text to be shown when file is deleted
     */
    private translations = {
        'deleted': '',
        'alreadyDeleted': ''
    };

    /**
     * Gallery images with their initial format
     */
    private imagesRaw: GalleryImage[];

    /**
     * Groups with images
     */
    private groups: GalleryGroup[] | undefined;

    public imageDeletionFailed: boolean = false;

    /**
     * Full description
     */
    private customFullDescription: Description;

    /**
     * Indicates if local loader should be enabled
     */
    private localLoaderEnabled: boolean = false;

    /**
     * This indicates number of loaded images in all 'src' tags. 
     * https://stackoverflow.com/questions/39257687/detect-when-image-has-loaded-in-img-tag
     */
    private numberOfLoadedImages: number = 0;

    /**
     * Indicates total number of images
     */
    private totalImages: number = -1;

    /**
     * Key used to translate deleted text
     */
    private snackbarDeleteTextKey: string = 'webComponents.gallery.deleted';


    private plainGalleryRow: PlainGalleryConfig = {
        strategy: PlainGalleryStrategy.ROW,
        layout: new LineLayout({ width: '100px', height: '100px' }, { length: this.totalImages, wrap: true }, 'flex-start')
    };

    private customButtons: ButtonsConfig = {
        visible: true,
        strategy: ButtonsStrategy.CUSTOM,
        buttons: [
            {
                className: 'fa fa-trash white',
                type: ButtonType.CUSTOM,
                ariaLabel: 'custom trash aria label',
                fontSize: '20px'
            },
            {
                className: 'fa fa-download white',
                type: ButtonType.DOWNLOAD,
                ariaLabel: 'custom download aria label',
                fontSize: '20px'
            },
            {
                className: 'fa fa-external-link white',
                type: ButtonType.EXTURL,
                ariaLabel: 'custom exturl aria label',
                fontSize: '20px'
            },
            {
                className: 'fa fa-close white',
                type: ButtonType.CLOSE,
                ariaLabel: 'custom close aria label',
                fontSize: '20px'
            }
        ]
    };

    constructor(
        public dialog: MatDialog,
        public snackBarService: MatSnackBar,
        private localizationService: LocalizationService,
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

    onButtonBeforeHook(event: ButtonEvent) {
        if (!event || !event.button) {
            return;
        }

        // Invoked after a click on a button, but before that the related
        // action is applied.
        // For instance: this method will be invoked after a click
        // of 'close' button, but before that the modal gallery
        // will be really closed.

        if (event.button.type === ButtonType.CUSTOM) {
            // remove the current image and reassign all other to the array of images
            if (event.button.className === 'fa fa-trash white') {
                if (event.image) {
                    this.deleteImage(event.image);
                }
            }
        }
    }

    reloadData(): void {
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

        // translations
        this.initTranslations();

        // reset total images
        this.totalImages = -1;

        // reset number of loaded images
        this.numberOfLoadedImages = 0;

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

    private convertToImageType(image: GalleryImage): Image {
        if (!image) {
            throw Error(`Could not convert 'GalleryImage' to 'Image'`);
        }

        return new Image(
            Math.random(), // unique image id is required
            {
                extUrl: image.imageUrl,
                description: image.description ? image.description : '',
                alt: image.description ? image.description : '',
                img: image.imageUrl,
            }
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
            strategy: DescriptionStrategy.HIDE_IF_EMPTY
        };

        return customFullDescription;
    }

    private loadImage(): void {
        this.numberOfLoadedImages++;
    }

    private removeImage(image: Image): void {
        // set image as deleted
        this.deletedImageIds.push(image.id);

        // remove image
        this.images = _.reject(this.images, function (item) { return item.modal.extUrl === image.modal.extUrl; });

        // remove image from groups as well
        if (this.groups) {
            this.groups.forEach(group => {
                group.images = _.reject(group.images, function (item) { return item.modal.extUrl === image.modal.extUrl; });

                // if group has 0 images, remove it as well
                if (group.images.length === 0 && this.groups) {
                    this.groups = _.reject(this.groups, function (item) { return item.groupTitle === group.groupTitle; });
                }
            });
        }


    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.gallery.deleted').map(result => this.translations.deleted = result)
            .zip(this.localizationService.get('webComponents.gallery.alreadyDeleted').map(result => this.translations.alreadyDeleted = result))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    /**
     * Call after the delete was confirmed
     * @param image Image to delete
     */
    private deleteImage(image: Image): void {
        if (!this.config.deleteFunction) {
            throw Error(`Gallery delete dialod requires delete function to be defined`);
        }

        if (this.deletedImageIds.find(m => m === image.id)) {
            // means that the image was already deleted
            this.snackBarService.open(this.translations.alreadyDeleted, undefined, { duration: this.snackbarDefaultDuration });
            return;
        }

        this.imageDeletionFailed = false;

        // get the proper GalleryImage
        const galleryImage = this.imagesRaw.find(m => m.imageUrl === image.modal.extUrl);
        if (!galleryImage) {
            throw Error(`Could not map image '${image.modal.extUrl}' to GalleryImage for deletion`);
        }

        // start loader
        if (this.config.loaderConfig) {
            this.config.loaderConfig.start();
        }

        this.localLoaderEnabled = true;

        this.config.deleteFunction(galleryImage)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(imageDeleted => {
                if (imageDeleted) {
                    // image was successfully deleted
                    if (this.config.onDelete && galleryImage) {
                        this.config.onDelete(galleryImage);
                    }

                    // remove image from local variables
                    this.removeImage(image);

                    // show snackbar message
                    this.snackBarService.open(this.translations.deleted, undefined, { duration: this.snackbarDefaultDuration });
                } else {
                    // image deletion failed
                    this.imageDeletionFailed = true;
                }

                // stop loader
                if (this.config.loaderConfig) {
                    this.config.loaderConfig.stop();
                }

                this.localLoaderEnabled = false;
            },
            error => {
                // image deletion faield
                this.imageDeletionFailed = true;

                // stop loader
                if (this.config.loaderConfig) {
                    this.config.loaderConfig.stop();
                }

                this.localLoaderEnabled = false;
            });
    }
}
