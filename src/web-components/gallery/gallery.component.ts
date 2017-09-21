// common
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// gallery classes
import { Image } from 'angular-modal-gallery';

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

        // finally mark component as initialized
        this.initialized = true;
    }

    private getButtonsConfig(config: GalleryConfig): any {
        if (config.downloadable){
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
            null,
            '',
            m.imageUrl
        ));
    }
}