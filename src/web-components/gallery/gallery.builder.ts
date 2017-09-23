import { GalleryImage } from './gallery-image.class';
import { GalleryConfig } from './gallery.config';
import { GalleryGroup } from './gallery-group.class';
import { ImageGroupResult } from './image-group-result.class';
import { Observable } from 'rxjs/Rx';

export class GalleryBuilder {

    private config: GalleryConfig;

    constructor(options: {
        images: GalleryImage[]
    }) {
        this.config = new GalleryConfig({
            images: options.images
        })
    }

    /**
     * Indicates if images can be downloaded easily
     * @param downloadable true if images can be downloaded easily
     */
    isDownlodable(downloadable: boolean): this {
        this.config.downloadable = downloadable;
        return this;
    }

    /**
     * Function used to group images to different categories
     * Return string that will be used as the group title
     */
    groupResolver(resolver: (image: GalleryImage) => ImageGroupResult): this {
        this.config.groupResolver = resolver;
        return this;
    }

    /**
     * Used to order gallery groups. Applicable only if 'groupResolver' is set
     * @param orderFunction Order function
     */
    groupsOrder(orderFunction: (groups: GalleryGroup[]) => GalleryGroup[]): this {
        this.config.groupsOrder = orderFunction;
        return this;
    }

    /**
     * Dialog width
     * Example: '70%'
     */
    dialogWidth(width: string): this {
        this.config.dialogWidth = width;
        return this;
    }

    /**
     * Function called when deleting an image.
     * Observable true = file was deleted successfully, false = file could not be deleted
     */
    deleteFunction(callback: (image: GalleryImage) => Observable<boolean>): this {
        this.config.deleteFunction = callback;
        return this;
    }

    /**
    * Callback for deleting an image. Can be used to display snackbar to user
    */
    onDelete(callback: (image: GalleryImage) => void) : this {
        this.config.onDelete = callback;
        return this;
    }

    /**
     * Build the gallery configuration
     */
    build(): GalleryConfig {
        return this.config;
    }
}