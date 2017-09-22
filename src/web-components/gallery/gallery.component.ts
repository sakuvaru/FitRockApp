// common
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// gallery classes
import { Image, Description, ImageModalEvent } from 'angular-modal-gallery';

// required by component
import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';
import { GalleryGroup } from './gallery-group.class';
import { ImageGroupResult } from './image-group-result.class';

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
     * This is required for the image pointer feature
     */
    private openModalWindow: boolean = false;
    private imagePointer: number = 0;

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
        this.images = this.convertArrayToImageType(config.images);

        // init buttons config
        this.buttonsConfig = this.getButtonsConfig(config);

        // init custom description
        this.customFullDescription = this.getCustomDescription();

        // init gallery groups if configured
        if (config.groupResolver)   {
            this.groups = this.getGalleryGroups(config);
        }

        // finally mark component as initialized
        this.initialized = true;
    }

    openImageModal(image: Image) {
        // find image based on its URL
        var imageToOpen = this.images.find(m => m.extUrl === image.extUrl);
        if (!imageToOpen){
            console.warn('Could not open image in modal:');
            console.warn(image);
        }
        else{
            this.imagePointer = this.images.indexOf(imageToOpen);
            this.openModalWindow = true;
        }
    }

    onShowImageModal(event: ImageModalEvent) {
    }

    onCloseImageModal(event: ImageModalEvent) {
        this.openModalWindow = false;
    }

    private getGalleryGroups(config: GalleryConfig): GalleryGroup[] {
        var groups: GalleryGroup[] = [];

        // go through each image and assign it to correct group based on the evaluation function
        if (!config || !config.images || !Array.isArray(config.images)){
            throw Error(`Could not evaluate gallery groups`);
        }

        config.images.forEach(image => {

            if (!config.groupResolver){
                throw Error(`Could not evaluate gallery groups because no resolver is defined`);
            }

            // get image group
            var imageGroup = config.groupResolver(image);

            // create group if not exist
            var group = groups.find(m => m.groupTitle === imageGroup.groupTitle);
            if (!group){
                // group does not exist, create it
                groups.push(new GalleryGroup(imageGroup.groupTitle, [this.convertToImageType(image)], imageGroup.groupDate));
            }
            else{
                // group exists, push the image
                group.images.push(this.convertToImageType(image));
            }
        });

        // order groups
        if (config.groupsOrder){
            groups = config.groupsOrder(groups); 
        }

        return groups;
    }

    private getButtonsConfig(config: GalleryConfig): any {
        if (config.downloadable) {
            var buttonsConfig: any = {};
            buttonsConfig.download = true;
            return buttonsConfig;
        }
        return null;
    }

    private convertToImageType(image: GalleryImage): Image {
       if (!image){
           throw Error(`Could not convert 'GalleryImage' to 'Image'`)
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