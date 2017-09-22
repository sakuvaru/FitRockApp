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

    /**
     * Function used to group images to different categories
     * Return string that will be used as the group title
     */
    public groupResolver: (image: GalleryImage) => string;

    constructor(
        options:{
            // required
            images: GalleryImage[],

            // optional
            downloadable?: boolean,
            groupResolver?: (image: GalleryImage) => string
        }
    ){
        Object.assign(this, options);
    }

}