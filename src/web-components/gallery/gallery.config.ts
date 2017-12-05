import { Observable } from 'rxjs/Rx';

import { GalleryGroup } from './gallery-group.class';
import { GalleryImage } from './gallery-image.class';
import { ImageGroupResult } from './image-group-result.class';

export class GalleryConfig {

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

    /**
     * Width of the dialog
     * Example: '70%'
     */
    public dialogWidth: string = '70%';

    /**
     * Function called when deleting an image.
     * Observable true = file was deleted successfully, false = file could not be deleted
     */
    public deleteFunction?: (image: GalleryImage) => Observable<boolean>;

    /**
     * Callback for deleting an image. Can be used to display snackbar to user
     */
    public onDelete?: (image: GalleryImage) => void;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader: boolean = true;

    /**
     * Loader configuration
     */
    public loaderConfig?: { start: () => void, stop: () => void };

    /**
     * Callback for when images are loaded
     */
    public onImagesLoaded: (images: GalleryImage[]) => void;

    constructor(
        /**
         * Function to get gallery images
         */
        public images: Observable<GalleryImage[]>
    ) { }
}
