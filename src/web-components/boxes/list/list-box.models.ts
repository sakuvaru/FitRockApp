import { Observable } from 'rxjs/Rx';
import { ActionButton } from '../shared/shared.models';
import { TextAlignEnum } from '../../shared/enums/text-align.enum';

export class ListBoxItem {

    public extra?: Observable<string>;
    public secondLine?: Observable<string>;
    public linkUrl?: string;
    public imageUrl?: string;
    public icon?: string;

    constructor(
        public firstLine: Observable<string>,
        private options?: {
            extra?: Observable<string>
            secondLine?: Observable<string>,
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

