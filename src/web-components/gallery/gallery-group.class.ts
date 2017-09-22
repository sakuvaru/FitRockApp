// gallery classes
import { Image } from 'angular-modal-gallery';

export class GalleryGroup {

    constructor(
        public groupTitle: string,
        public images: Image[],
        public groupDate?: Date
    ) { }
}