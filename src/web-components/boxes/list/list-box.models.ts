import { Observable } from 'rxjs/Rx';

import { TextClass } from '../..//shared/enums/text-class.enum';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';
import { ActionButton } from '../shared/shared.models';

export class ListBoxLine {

    public lineExtra?: Observable<string>;

    constructor(
        public text: Observable<string>,
        public type: TextClass = TextClass.Body1,
        private options?: {
            lineExtra?: Observable<string>
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class ListBoxItem {

    public linkUrl?: string;
    public imageUrl?: string;
    public icon?: string;

    constructor(
        public lines: ListBoxLine[],
        private options?: {
            linkUrl?: string,
            imageUrl?: string,
            icon?: string
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class ListBoxConfig {

    public wrapInCard: boolean = false;
    public title?: Observable<string>;
    public titleAlign: TextAlignEnum = TextAlignEnum.Left;
    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    constructor(
        public items: Observable<ListBoxItem[]>,
        private options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[],
            title?: Observable<string>,
            titleAlign?: TextAlignEnum,
            wrapInCard?: boolean
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

