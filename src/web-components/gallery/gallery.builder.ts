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
     * Build the gallery configuration
     */
    build(): GalleryConfig {
        return this.config;
    }
}