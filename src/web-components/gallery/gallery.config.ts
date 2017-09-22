import { GalleryImage } from './gallery-image.class';
import { GalleryGroup } from './gallery-group.class';
import { ImageGroupResult } from './image-group-result.class';

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
    public groupResolver?: (image: GalleryImage) => ImageGroupResult;

    /**
     * Can be used to order gallery groups
     */
    public groupsOrder?: (groups: GalleryGroup[]) => GalleryGroup[];

    constructor(
        options: {
            // required
            images: GalleryImage[],

            // optional
            downloadable?: boolean,
            groupResolver?: (image: GalleryImage) => ImageGroupResult,
            groupsOrder?: (groups: GalleryGroup[]) => GalleryGroup[]
        }
    ) {
        Object.assign(this, options);
    }

}