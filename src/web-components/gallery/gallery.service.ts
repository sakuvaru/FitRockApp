import { GalleryBuilder } from './gallery.builder';
import { GalleryImage } from './gallery-image.class';
import { Observable } from 'rxjs/Rx';

export class GalleryService {

    /**
     * Gallery component
     * @param images Function that loads images
     */
    gallery(
        images: Observable<GalleryImage[]>
    ): GalleryBuilder {
        return new GalleryBuilder(images);
    }
}
