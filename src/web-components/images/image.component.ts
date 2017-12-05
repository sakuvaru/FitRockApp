import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../base-web-component.class';

@Component({
    selector: 'image',
    templateUrl: 'image.component.html'
})
export class ImageComponent extends BaseWebComponent {

    /**
     * Url of the image
     */
    @Input() url?: string;

    /**
     * Image used if the url is not set
     */
    @Input() defaultUrl?: string;

    /**
     * Alt attribute of image
     */
    @Input() alt?: string;

    /**
     * Indicates if the image should be presented as avatar
     */
    @Input() avatarMode: boolean = false;

    constructor(
    ) { super();
    }
}
