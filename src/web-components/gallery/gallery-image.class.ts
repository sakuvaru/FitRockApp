export class GalleryImage {

    /**
     * Url of the image
     */
    public imageUrl: string;

    /**
     * Date of the image
     */
    public imageDate?: Date;

    /**
     * Description of the image
     */
    public description?: string | null = null;

    /**
     * Url to thumbnail image
     */
    public thumbnailUrl?: string;

    constructor(options: {
        // required
        imageUrl: string,

        // optional
        imageDate?: Date,
        description?: string
        thumbnailUrl?: string
    }) { 
        Object.assign(this, options);
    }
}