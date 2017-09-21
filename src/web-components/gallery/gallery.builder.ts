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

    isDownlodable(downloadable: boolean): this {
        this.config.downloadable = downloadable;
        return this;
    }

    build(): GalleryConfig {
        return this.config;
    }
}