import { GalleryImage } from './gallery-image.class';

export class GalleryConfig {

    /**
     * Gallery images
     */
    public images: GalleryImage[];

    /**
     * Indicates if image can be easily downloaded
     */
    public downloadable: boolean = true;

    constructor(
        options:{
            // required
            images: GalleryImage[],

            // optional
            downloadable?: boolean;
        }
    ){
        Object.assign(this, options);
    }

}