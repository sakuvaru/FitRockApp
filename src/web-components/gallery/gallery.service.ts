import { GalleryBuilder } from './gallery.builder';
import { GalleryImage } from './gallery-image.class';

export class GalleryService {

    gallery(options: {
        images: GalleryImage[]
    }): GalleryBuilder {
        return new GalleryBuilder({
            images: options.images
        });
    }
}