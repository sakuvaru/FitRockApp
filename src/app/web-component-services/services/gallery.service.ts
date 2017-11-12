import { GalleryBuilder, GalleryImage } from '../../../web-components/gallery';
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
