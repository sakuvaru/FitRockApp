import { GalleryImage } from './gallery-image.class';
import { GalleryGroup } from './gallery-group.class';
import { ImageGroupResult } from './image-group-result.class';
import { Observable } from 'rxjs/Rx';

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

    constructor(
        options: {
            // required
            images: GalleryImage[],

            // optional
            downloadable?: boolean,
            groupResolver?: (image: GalleryImage) => ImageGroupResult,
            groupsOrder?: (groups: GalleryGroup[]) => GalleryGroup[],
            dialogWidth?: string,
            deleteFunction?: (image: GalleryImage) => Observable<boolean>,
            onDelete?: (image: GalleryImage) => void
        }
    ) {
        Object.assign(this, options);
    }

}