export class GalleryImage {

    /**
     * Url of the image
     */
    public imageUrl: string;

    constructor(options: {
        imageUrl: string
    }) { 
        Object.assign(this, options);
    }
}