import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';

export class GalleryBuilder {

    private config: GalleryConfig;

    constructor(options: {
        images: GalleryImage[]
    }) {
        this.config = new GalleryConfig({
            images: options.images
        })
    }

    /**
     * Indicates if images can be downloaded easily
     * @param downloadable true if images can be downloaded easily
     */
    isDownlodable(downloadable: boolean): this {
        this.config.downloadable = downloadable;
        return this;
    }

    /**
     * Function used to group images to different categories
     * Return string that will be used as the group title
     */
    groupResolver(resolver: (image: GalleryImage) => string): this {
        this.config.groupResolver = resolver;
        return this;
    }

    /**
     * Build the gallery configuration
     */
    build(): GalleryConfig {
        return this.config;
    }
}