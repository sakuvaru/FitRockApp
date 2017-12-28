import { Observable } from 'rxjs/Rx';
import { ActionButton } from '../shared/shared.models';

export class ListBoxItem {
    constructor(
        public text: string | Observable<string>,
        public linkUrl?: string,
        public imageUrl?: string, 
        public icon?: string,
    ) { }
}

export class ListBoxConfig {

    public noDataMessage?: Observable<string>;
    public actions?: ActionButton[];

    constructor(
        public items: Observable<ListBoxItem[]>,
        public title: Observable<string>,
        private options?: {
            noDataMessage?: Observable<string>,
            actions?: ActionButton[]
        }
    )  { 
        if (options) {
            Object.assign(this, options);
        }
    }
}

