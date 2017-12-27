import { Observable } from 'rxjs/Rx';

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

    constructor(
        public items: Observable<ListBoxItem[]>,
        public title: Observable<string>,
        private options?: {
            noDataMessage?: Observable<string>
        }
    )  { 
        if (options) {
            Object.assign(this, options);
        }
    }
}

