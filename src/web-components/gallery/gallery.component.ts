// common
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// gallery classes
import { Image, Description, ImageModalEvent } from 'angular-modal-gallery';

// required by component
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

@Component({
    selector: 'gallery',
    templateUrl: 'gallery.component.html'
})
export class GalleryComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() config: GalleryConfig;

    /**
     * Component initiliazed flag
     */
    private initialized: boolean = false;

    /**
     * Gallery images
     */
    private images: Image[];

    /**
     * Buttons configuration
     */
    private buttonsConfig: any = {};

    /**
     * Full description
     */
    private customFullDescription: Description;

    constructor(
    ) {
        super()
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

    private initGallery(config: GalleryConfig) {
        if (!config) {
            console.warn('Gallery could not be initialized');
            return;
        }

        // flag component as not yet initalized
        this.initialized = false;

        // make sure config is assigned
        this.config = config;

        // assign gallery images
        this.images = this.convertToImageType(config.images);

        // init buttons config
        this.buttonsConfig = this.getButtonsConfig(config);

        // init custom description
        this.customFullDescription = this.getCustomDescription();

        // finally mark component as initialized
        this.initialized = true;
    }
    
    onShowImageModal(event: ImageModalEvent) {
    }
    
    onCloseImageModal(event: ImageModalEvent) {
    }

    onImageOver(): void {
    }

    private getButtonsConfig(config: GalleryConfig): any {
        if (config.downloadable) {
            var buttonsConfig: any = {};
            buttonsConfig.download = true;
            return buttonsConfig;
        }
        return null;
    }


    private convertToImageType(images: GalleryImage[]): Image[] {
        if (!images || !Array.isArray(images)) {
            return [];
        }

        return images.map(m => new Image(
            m.imageUrl,
            m.thumbnailUrl,
            m.description,
            m.imageUrl
        ));
    }

    private getCustomDescription(): Description {
        var customFullDescription: Description = {
            // you should build this value programmaticaly with the result of (show)="..()" event
            // if customFullDescription !== undefined, all other fields will be ignored
            imageText: '', // removes the 'Image' string from the gallery
            numberSeparator: '/',
            // beforeTextDescription: '',
        };

        return customFullDescription;
    }
}