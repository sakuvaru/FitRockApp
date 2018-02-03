import { Component, Input } from '@angular/core';

import { BaseWebComponent } from '../../base-web-component.class';

@Component({
    selector: 'comment',
    templateUrl: 'comment.component.html'
})
export class CommentComponent extends BaseWebComponent {

    @Input() type: 'primary' | 'secondary';

    /**
     * Text of the message / comment
     */
    @Input() text: string;

    /**
     * Avatar url
     */
    @Input() avatarUrl: string;

    /**
     * Name of the person
     */
    @Input() name: string;

    /**
     * Formatted date of the message
     */
    @Input() date: string;

    constructor(
    ) { super();
    }
}
